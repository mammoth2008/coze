// apps/logistics/api.config.js

const path = require('path');

const config = [
  {
    idlRoot: '../../../../opencoze', // idl 根目录
    entries: {
      passport: './idl/passport/passport.thrift', // 入口服务名称及路径
      explore:
        './idl/flow/marketplace/flow_marketplace_product/public_api.thrift',
    },
    commonCodePath: path.resolve(__dirname, './src/api/config.ts'), // 自定义配置文件
    output: './src', // 产物所在位置
    plugins: [], // 自定义插件
  },
];

module.exports = config;
