// Original Files: open-telemetry/opentelemetry-collector
// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0
// This file may have been modified by ByteDance Ltd.

package service

import (
	"context"
	"errors"
	"fmt"
	"hash/fnv"
	"strings"

	"gonum.org/v1/gonum/graph/simple"
	"gonum.org/v1/gonum/graph/topo"

	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/entity/collector/component"
	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/entity/collector/consumer"
	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/entity/collector/exporter"
	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/entity/collector/processor"
	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/entity/collector/receiver"
)

const (
	receiverSeed      = "receiver"
	processorSeed     = "processor"
	exporterSeed      = "exporter"
	fanOutToExporters = "fanout_to_exporters"
)

type nodeID int64

func (n nodeID) ID() int64 {
	return int64(n)
}

func newNodeID(parts ...string) nodeID {
	h := fnv.New64a()
	h.Write([]byte(strings.Join(parts, "|")))
	return nodeID(h.Sum64())
}

type consumerNode interface {
	getConsumer() consumer.BaseConsumer
}

type receiverNode struct {
	nodeID
	componentID component.ID
	component.Component
}

func newReceiverNode(recvID component.ID) *receiverNode {
	return &receiverNode{
		nodeID:      newNodeID(receiverSeed, recvID.String()),
		componentID: recvID,
	}
}

func (n *receiverNode) buildComponent(ctx context.Context, builder *receiver.Builder, next consumer.BaseConsumer) error {
	set := receiver.CreateSettings{
		ID: n.componentID,
	}
	var err error
	n.Component, err = builder.CreateTraces(ctx, set, next.(consumer.Consumer))
	if err != nil {
		return fmt.Errorf("failed to create %q receiver, %v", set.ID, err)
	}
	return nil
}

func (n *receiverNode) getConsumer() consumer.BaseConsumer {
	return n.Component.(consumer.BaseConsumer)
}

type processorNode struct {
	nodeID
	componentID component.ID
	component.Component
}

func newProcessorNode(procID component.ID) *processorNode {
	return &processorNode{
		nodeID:      newNodeID(processorSeed, procID.String()),
		componentID: procID,
	}
}

func (n *processorNode) buildComponent(ctx context.Context, builder *processor.Builder, next consumer.BaseConsumer) error {
	set := processor.CreateSettings{
		ID: n.componentID,
	}
	var err error
	n.Component, err = builder.Create(ctx, set, next.(consumer.Consumer))
	if err != nil {
		return fmt.Errorf("failed to create %q processor, %v", set.ID, err)
	}
	return nil
}

func (n *processorNode) getConsumer() consumer.BaseConsumer {
	return n.Component.(consumer.BaseConsumer)
}

type exporterNode struct {
	nodeID
	componentID component.ID
	component.Component
}

func newExporterNode(exprID component.ID) *exporterNode {
	return &exporterNode{
		nodeID:      newNodeID(exporterSeed, exprID.String()),
		componentID: exprID,
	}
}

func (n *exporterNode) buildComponent(ctx context.Context, builder *exporter.Builder) error {
	set := exporter.CreateSettings{
		ID: n.componentID,
	}
	var err error
	n.Component, err = builder.Create(ctx, set)
	if err != nil {
		return fmt.Errorf("failed to create %q exporter, %v", set.ID, err)
	}
	return nil
}

func (n *exporterNode) getConsumer() consumer.BaseConsumer {
	return n.Component.(consumer.BaseConsumer)
}

type fanOutNode struct {
	nodeID
	consumer.BaseConsumer
}

func newFanOutNode() *fanOutNode {
	return &fanOutNode{
		nodeID: newNodeID(fanOutToExporters),
	}
}

func (n *fanOutNode) buildComponent(ctx context.Context, nexts []consumer.BaseConsumer) error {
	consumers := make([]consumer.Consumer, 0, len(nexts))
	for _, next := range nexts {
		consumers = append(consumers, next.(consumer.Consumer))
	}
	n.BaseConsumer = consumer.NewFanoutConsumer(consumers)
	return nil
}

func (n *fanOutNode) getConsumer() consumer.BaseConsumer {
	return n.BaseConsumer
}

type pipelineNodes struct {
	receivers  map[int64]*receiverNode
	processors []*processorNode
	*fanOutNode
	exporters map[int64]*exporterNode
}

type Graph struct {
	componentGraph *simple.DirectedGraph
	pipelineNodes  *pipelineNodes
}

func BuildGraph(ctx context.Context, set Settings) (*Graph, error) {
	g := &Graph{
		componentGraph: simple.NewDirectedGraph(),
		pipelineNodes: &pipelineNodes{
			receivers:  make(map[int64]*receiverNode),
			processors: make([]*processorNode, 0),
			exporters:  make(map[int64]*exporterNode),
		},
	}
	if err := g.createNodes(set); err != nil {
		return nil, err
	}
	g.createEdges()
	err := g.buildComponents(ctx, set)
	if err != nil {
		return nil, err
	}
	return g, nil
}

func (g *Graph) createNodes(set Settings) error {
	for _, recvID := range set.PipelineConfig.Receivers {
		rcvrNode := g.createReceiver(recvID)
		g.pipelineNodes.receivers[rcvrNode.ID()] = rcvrNode
	}
	for _, procID := range set.PipelineConfig.Processors {
		procNode := g.createProcessor(procID)
		g.pipelineNodes.processors = append(g.pipelineNodes.processors, procNode)
	}
	g.pipelineNodes.fanOutNode = newFanOutNode()
	for _, exprID := range set.PipelineConfig.Exporters {
		expNode := g.createExporter(exprID)
		g.pipelineNodes.exporters[expNode.ID()] = expNode
	}
	return nil
}

func (g *Graph) createReceiver(recvID component.ID) *receiverNode {
	rcvrNode := newReceiverNode(recvID)
	if node := g.componentGraph.Node(rcvrNode.ID()); node != nil {
		return node.(*receiverNode)
	}
	g.componentGraph.AddNode(rcvrNode)
	return rcvrNode
}

func (g *Graph) createProcessor(procID component.ID) *processorNode {
	procNode := newProcessorNode(procID)
	if node := g.componentGraph.Node(procNode.ID()); node != nil {
		return node.(*processorNode)
	}
	g.componentGraph.AddNode(procNode)
	return procNode
}

func (g *Graph) createExporter(exprID component.ID) *exporterNode {
	expNode := newExporterNode(exprID)
	if node := g.componentGraph.Node(expNode.ID()); node != nil {
		return node.(*exporterNode)
	}
	g.componentGraph.AddNode(expNode)
	return expNode
}

func (g *Graph) createEdges() {
	for _, rcvrNode := range g.pipelineNodes.receivers {
		g.componentGraph.SetEdge(g.componentGraph.NewEdge(rcvrNode, g.pipelineNodes.processors[0]))
	}
	for i := 1; i < len(g.pipelineNodes.processors); i++ {
		g.componentGraph.SetEdge(g.componentGraph.NewEdge(g.pipelineNodes.processors[i-1], g.pipelineNodes.processors[i]))
	}
	g.componentGraph.SetEdge(g.componentGraph.NewEdge(g.pipelineNodes.processors[len(g.pipelineNodes.processors)-1], g.pipelineNodes.fanOutNode))
	for _, expNode := range g.pipelineNodes.exporters {
		g.componentGraph.SetEdge(g.componentGraph.NewEdge(g.pipelineNodes.fanOutNode, expNode))
	}
}

func (g *Graph) buildComponents(ctx context.Context, set Settings) error {
	nodes, err := topo.Sort(g.componentGraph)
	if err != nil {
		return fmt.Errorf("cycle detected")
	}
	for i := len(nodes) - 1; i >= 0; i-- {
		node := nodes[i]
		switch n := node.(type) {
		case *receiverNode:
			err = n.buildComponent(ctx, set.ReceiverBuilder, g.nextConsumers(n.ID())[0])
		case *processorNode:
			err = n.buildComponent(ctx, set.ProcessorBuilder, g.nextConsumers(n.ID())[0])
		case *exporterNode:
			err = n.buildComponent(ctx, set.ExporterBuilder)
		case *fanOutNode:
			err = n.buildComponent(ctx, g.nextConsumers(n.ID()))
		}
		if err != nil {
			return err
		}
	}
	return nil
}

func (g *Graph) nextConsumers(nodeID int64) []consumer.BaseConsumer {
	nextNodes := g.componentGraph.From(nodeID)
	nexts := make([]consumer.BaseConsumer, 0, nextNodes.Len())
	for nextNodes.Next() {
		nexts = append(nexts, nextNodes.Node().(consumerNode).getConsumer())
	}
	return nexts
}

func (g *Graph) StartAll(ctx context.Context) error {
	nodes, err := topo.Sort(g.componentGraph)
	if err != nil {
		return err
	}
	// Start in reverse topological order so that downstream components
	// are started before upstream components. This ensures that each
	// component's consumer is ready to consume.
	for i := len(nodes) - 1; i >= 0; i-- {
		node := nodes[i]
		comp, ok := node.(component.Component)
		if !ok { // Skip fanout nodes
			continue
		}
		if compErr := comp.Start(ctx); compErr != nil {
			return compErr
		}
	}
	return nil
}

func (g *Graph) ShutdownAll(ctx context.Context) error {
	nodes, err := topo.Sort(g.componentGraph)
	if err != nil {
		return err
	}
	// Stop in topological order so that upstream components
	// are stopped before downstream components.  This ensures
	// that each component has a chance to drain to its consumer
	// before the consumer is stopped.
	var errs []error
	for i := 0; i < len(nodes); i++ {
		node := nodes[i]
		comp, ok := node.(component.Component)
		if !ok {
			// Skip fanout nodes
			continue
		}
		if compErr := comp.Shutdown(ctx); compErr != nil {
			errs = append(errs, compErr)
			continue
		}
	}
	return errors.Join(errs...)
}
