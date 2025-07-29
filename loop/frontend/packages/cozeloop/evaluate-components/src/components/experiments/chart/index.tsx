// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef } from 'react';

import ReactDOM, { createRoot } from 'react-dom/client';
import { type Datum } from '@visactor/vchart/esm/typings';
import VChart, {
  type TooltipHandlerParams,
  type ISpec,
  type ITooltipActual,
} from '@visactor/vchart';

export {
  default as ChartCardItemRender,
  type ChartCardItem,
} from './chart-card-item-render';

export interface CustomTooltipProps {
  tooltipElement: HTMLElement;
  actualTooltip: ITooltipActual;
  params: TooltipHandlerParams;
}

interface ChartProps {
  spec: ISpec;
  values: Datum[];
  className?: string;
  customTooltip?: (props: CustomTooltipProps) => JSX.Element | null;
}

export function Chart({
  spec,
  values = [],
  className,
  customTooltip,
}: ChartProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const vChartRef = useRef<VChart>();

  useEffect(() => {
    if (!divRef.current) {
      return;
    }
    const CustomTooltip = customTooltip;
    const tooltip: ISpec['tooltip'] = {
      ...(spec?.tooltip ?? {}),
    };
    // 自定义渲染 tooltip 内容
    if (CustomTooltip) {
      tooltip.updateElement = (tooltipElement, actualTooltip, params) => {
        tooltipElement.style.width = 'auto';
        const root = createRoot(tooltipElement);
        root.render(
          <CustomTooltip
            params={params}
            actualTooltip={actualTooltip}
            tooltipElement={tooltipElement}
          />,
        );
      };
    }
    const newSpec = {
      data: [
        {
          id: 'data',
          values,
        },
      ],
      // xField: 'name',
      // yField: 'score',
      crosshair: {
        xField: { visible: true },
        followTooltip: false,
      },
      color: ['#6D62EB'],
      // outerRadius: 0.8,
      // innerRadius: 0.5,
      // padAngle: 0.6,
      ...spec,
      tooltip,
      type: spec?.type ?? 'bar',
    } as unknown as ISpec;

    if (!vChartRef.current) {
      const vChart = new VChart(newSpec, {
        dom: divRef.current,
        ReactDOM,
        enableHtmlAttribute: true,
      });
      vChart.renderSync();
      vChartRef.current = vChart;

      setTimeout(() => {
        const containerRect =
          divRef.current?.parentElement?.getBoundingClientRect();
        if (containerRect) {
          vChart.resize(containerRect.width, containerRect.height);
        }
      }, 10);
    } else {
      vChartRef.current.updateSpecSync(newSpec);
    }

    return () => {
      vChartRef.current?.hideTooltip();
    };
  }, [spec, values]);

  return <div ref={divRef} className={className} data-chart="true" />;
}
