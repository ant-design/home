/* eslint-disable import/no-unresolved */

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs-extra');
const antd = require('../lib');
const { statistic } = require('../lib/_util/theme/util/statistic');
const useMessageStyle = require('../lib/message/style/index').default;
const useNotificationStyle = require('../lib/notification/style/index').default;

// Automatic rendering
Object.entries(antd).forEach(([key, component]) => {
  if (
    /[A-Z]/.test(key.charAt(0)) &&
    key !== 'Form' &&
    key !== 'Dropdown' &&
    key !== 'Grid' &&
    key !== 'ConfigProvider'
  ) {
    ReactDOMServer.renderToString(React.createElement(component));
  }
});

const EmptyElement = React.createElement('div');

// Dropdown
ReactDOMServer.renderToString(
  React.createElement(antd.Dropdown, { overlay: EmptyElement }, EmptyElement),
);

// Form
ReactDOMServer.renderToString(React.createElement(antd.Form, undefined, EmptyElement));

// message
const Message = () => {
  useMessageStyle('message');
  return EmptyElement;
};
ReactDOMServer.renderToString(React.createElement(Message));

// Notification
const Notification = () => {
  useNotificationStyle('notification');
  return EmptyElement;
};
ReactDOMServer.renderToString(React.createElement(Notification));

(async () => {
  const libPath = `${process.cwd()}/lib/_util/theme/util/statistic.js`;
  const libContent = await fs.readFile(libPath, 'utf8');
  const newLibContent = `${libContent}\nexports._statistic_build_ = ${JSON.stringify(statistic)}`;
  await fs.writeFile(libPath, newLibContent, 'utf8');
})();
