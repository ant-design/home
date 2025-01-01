---
category: Components
group: Other
title: ConfigProvider
description: Provide a uniform configuration support for components.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NVKORa7BCVwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YC4ERpGAddoAAAAAAAAAAAAADrJ8AQ/original
---

## Usage

This component provides a configuration to all React components underneath itself via the [context API](https://react.dev/learn/passing-data-deeply-with-context). In the render tree all components will have access to the provided config.

```tsx
import React from 'react';
import { ConfigProvider } from 'antd';

// ...
const Demo: React.FC = () => (
  <ConfigProvider direction="rtl">
    <App />
  </ConfigProvider>
);

export default Demo;
```

### Content Security Policy

Some components use dynamic style to support wave effect. You can config `csp` prop if Content Security Policy (CSP) is enabled:

```tsx
<ConfigProvider csp={{ nonce: 'YourNonceCode' }}>
  <Button>My Button</Button>
</ConfigProvider>
```

## Examples

<!-- prettier-ignore -->
<code src="./demo/locale.tsx">Locale</code>
<code src="./demo/direction.tsx">Direction</code>
<code src="./demo/size.tsx">Component size</code>
<code src="./demo/theme.tsx">Theme</code>
<code src="./demo/wave.tsx">Custom Wave</code>
<code src="./demo/holderRender.tsx">Static function</code>
<code src="./demo/prefixCls.tsx" debug>prefixCls</code>
<code src="./demo/useConfig.tsx" debug>useConfig</code>
<code src="./demo/warning.tsx" debug>warning</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| componentDisabled | Config antd component `disabled` | boolean | - | 4.21.0 |
| componentSize | Config antd component size | `small` \| `middle` \| `large` | - |  |
| csp | Set [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) config | { nonce: string } | - |  |
| direction | Set direction of layout. See [demo](#config-provider-demo-direction) | `ltr` \| `rtl` | `ltr` |  |
| getPopupContainer | To set the container of the popup element. The default is to create a `div` element in `body` | function(triggerNode) | () => document.body |  |
| getTargetContainer | Config Affix, Anchor scroll target container | () => HTMLElement | () => window | 4.2.0 |
| iconPrefixCls | Set icon prefix className | string | `anticon` | 4.11.0 |
| locale | Language package setting, you can find the packages in [antd/locale](http://unpkg.com/antd/locale/) | object | - |  |
| popupMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | - | 5.5.0 |
| popupOverflow | Select like component popup logic. Can set to show in viewport or follow window scroll | 'viewport' \| 'scroll' <InlinePopover previewURL="https://user-images.githubusercontent.com/5378891/230344474-5b9f7e09-0a5d-49e8-bae8-7d2abed6c837.png"></InlinePopover> | 'viewport' | 5.5.0 |
| prefixCls | Set prefix className | string | `ant` |  |
| renderEmpty | Set empty content of components. Ref [Empty](/components/empty/) | function(componentName: string): ReactNode | - |  |
| theme | Set theme, ref [Customize Theme](/docs/react/customize-theme) | [Theme](/docs/react/customize-theme#theme) | - | 5.0.0 |
| variant | Set variant of data entry components | `outlined` \| `filled` \| `borderless` | - | 5.19.0 |
| virtual | Disable virtual scroll when set to `false` | boolean | - | 4.3.0 |
| warning | Config warning level, when `strict` is `false`, it will aggregate deprecated information into a single message | { strict: boolean } | - | 5.10.0 |

### ConfigProvider.config()

Setting `Modal`、`Message`、`Notification` static config. Not work on hooks.

```tsx
ConfigProvider.config({
  // 5.13.0+
  holderRender: (children) => (
    <ConfigProvider
      prefixCls="ant"
      iconPrefixCls="anticon"
      theme={{ token: { colorPrimary: 'red' } }}
    >
      {children}
    </ConfigProvider>
  ),
});
```

### ConfigProvider.useConfig() `5.3.0+`

Available since `5.2.0`. Get the value of the parent `Provider`. Such as `DisabledContextProvider`, `SizeContextProvider`.

```jsx
const {
  componentDisabled, // 5.3.0+
  componentSize, // 5.3.0+
} = ConfigProvider.useConfig();
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| componentDisabled | antd component disabled state | boolean | - | 5.3.0 |
| componentSize | antd component size state | `small` \| `middle` \| `large` | - | 5.3.0 |

### Component Config

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| alert | Set Alert common props | { className?: string, style?: React.CSSProperties, closeIcon?: React.ReactNode } | - | 5.7.0, closeIcon: 5.14.0 |
| anchor | Set Anchor common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| avatar | Set Avatar common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| badge | Set Badge common props | { className?: string, style?: React.CSSProperties, classNames?: [BadgeProps\["classNames"\]](/components/badge#api), styles?: [BadgeProps\["styles"\]](/components/badge#api) } | - | 5.7.0 |
| breadcrumb | Set Breadcrumb common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| button | Set Button common props | { className?: string, style?: React.CSSProperties, classNames?: [ButtonProps\["classNames"\]](/components/button#api), styles?: [ButtonProps\["styles"\]](/components/button#api), autoInsertSpace?: boolean } | - | 5.6.0, autoInsertSpace: 5.17.0 |
| card | Set Card common props | { className?: string, style?: React.CSSProperties, classNames?: [CardProps\["classNames"\]](/components/card#api), styles?: [CardProps\["styles"\]](/components/card#api) } | - | 5.7.0, `classNames` and `styles`: 5.14.0 |
| calendar | Set Calendar common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| carousel | Set Carousel common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| cascader | Set Cascader common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| checkbox | Set Checkbox common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| collapse | Set Collapse common props | { className?: string, style?: React.CSSProperties, expandIcon?: (props) => ReactNode } | - | 5.7.0, expandIcon: 5.15.0 |
| colorPicker | Set ColorPicker common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| datePicker | Set datePicker common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| rangePicker | Set rangePicker common props | { className?: string, style?: React.CSSProperties } | - | 5.11.0 |
| descriptions | Set Descriptions common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| divider | Set Divider common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| drawer | Set Drawer common props | { className?: string, style?: React.CSSProperties, classNames?: [DrawerProps\["classNames"\]](/components/drawer#api), styles?: [DrawerProps\["styles"\]](/components/drawer#api), closeIcon?: ReactNode } | - | 5.7.0, `classNames` and `styles`: 5.10.0, `closeIcon`: 5.14.0 |
| dropdown | Set Dropdown common props | { className?: string, style?: React.CSSProperties } | - | 5.11.0 |
| empty | Set Empty common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| flex | Set Flex common props | { className?: string, style?: React.CSSProperties, vertical?: boolean } | - | 5.10.0 |
| floatButtonGroup | Set FloatButton.Group common props | { closeIcon?: React.ReactNode } | - | 5.16.0 |
| form | Set Form common props | { className?: string, style?: React.CSSProperties, validateMessages?: [ValidateMessages](/components/form/#validatemessages), requiredMark?: boolean \| `optional`, scrollToFirstError?: boolean \| [Options](https://github.com/stipsan/scroll-into-view-if-needed/tree/ece40bd9143f48caf4b99503425ecb16b0ad8249#options) } | - | requiredMark: 4.8.0; colon: 4.18.0; scrollToFirstError: 5.2.0; className: 5.7.0; style: 5.7.0 |
| image | Set Image common props | { className?: string, style?: React.CSSProperties, preview?: { closeIcon?: React.ReactNode } } | - | 5.7.0, closeIcon: 5.14.0 |
| input | Set Input common props | { autoComplete?: string, className?: string, style?: React.CSSProperties, allowClear?: boolean \| { clearIcon?: ReactNode } } | - | 4.2.0, allowClear: 5.15.0 |
| textArea | Set TextArea common props | { autoComplete?: string, className?: string, style?: React.CSSProperties, allowClear?: boolean \| { clearIcon?: ReactNode } } | - | 5.15.0 |
| layout | Set Layout common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| list | Set List common props | { className?: string, style?: React.CSSProperties, item?:{ classNames: [ListItemProps\["classNames"\]](/components/list#listitem), styles: [ListItemProps\["styles"\]](/components/list#listitem) } } | - | 5.7.0 |
| menu | Set Menu common props | { className?: string, style?: React.CSSProperties, expandIcon?: ReactNode \| props => ReactNode } | - | 5.7.0, expandIcon: 5.15.0 |
| mentions | Set Mentions common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| message | Set Message common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| modal | Set Modal common props | { className?: string, style?: React.CSSProperties, classNames?: [ModalProps\["classNames"\]](/components/modal#api), styles?: [ModalProps\["styles"\]](/components/modal#api), closeIcon?: React.ReactNode } | - | 5.7.0, `classNames` and `styles`: 5.10.0, `closeIcon`: 5.14.0 |
| notification | Set Notification common props | { className?: string, style?: React.CSSProperties, closeIcon?: React.ReactNode } | - | 5.7.0, `closeIcon`: 5.14.0 |
| pagination | Set Pagination common props | { showSizeChanger?: boolean, className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| progress | Set Progress common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| radio | Set Radio common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| rate | Set Rate common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| result | Set Result common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| skeleton | Set Skeleton common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| segmented | Set Segmented common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| select | Set Select common props | { className?: string, showSearch?: boolean, style?: React.CSSProperties } | - | 5.7.0 |
| slider | Set Slider common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| switch | Set Switch common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| space | Set Space common props, ref [Space](/components/space) | { size: `small` \| `middle` \| `large` \| `number`, className?: string, style?: React.CSSProperties, classNames?: [SpaceProps\["classNames"\]](/components/space#api), styles?: [SpaceProps\["styles"\]](/components/space#api) } | - | 5.6.0 |
| splitter | Set Splitter common props | { className?: string, style?: React.CSSProperties } | - | 5.21.0 |
| spin | Set Spin common props | { className?: string, style?: React.CSSProperties, indicator?: React.ReactElement } | - | 5.7.0, indicator: 5.20.0 |
| statistic | Set Statistic common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| steps | Set Steps common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| table | Set Table common props | { className?: string, style?: React.CSSProperties, expandable?: { expandIcon?: props => React.ReactNode } } | - | 5.7.0, expandable: 5.14.0 |
| tabs | Set Tabs common props | { className?: string, style?: React.CSSProperties, indicator?: { size?: GetIndicatorSize, align?: `start` \| `center` \| `end` }, moreIcon?: ReactNode, addIcon?: ReactNode, removeIcon?: ReactNode } | - | 5.7.0, `moreIcon` and `addIcon`: 5.14.0, `removeIcon`: 5.15.0 |
| tag | Set Tag common props | { className?: string, style?: React.CSSProperties, closeIcon?: React.ReactNode } | - | 5.7.0, closeIcon: 5.14.0 |
| timeline | Set Timeline common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| timePicker | Set TimePicker common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| tour | Set Tour common props | { closeIcon?: React.ReactNode } | - | 5.14.0 |
| tooltip | Set Tooltip common props | { className?: string, style?: React.CSSProperties, classNames?:[Tooltip\["classNames"\]](/components/tooltip#api), styles?: [Tooltip\["styles"\]](/components/tooltip#api) } | - | 5.23.0 |
| popover | Set Popover common props | { className?: string, style?: React.CSSProperties, classNames?:[Popover\["classNames"\]](/components/popover#api), styles?: [Popover\["styles"\]](/components/popover#api) } | - | 5.23.0 |
| popconfirm | Set Popconfirm common props | { className?: string, style?: React.CSSProperties, classNames?:[Popconfirm\["classNames"\]](/components/popconfirm#api), styles?: [Popconfirm\["styles"\]](/components/popconfirm#api) } | - | 5.23.0 |
| qrcode | Set QRCode common props | { className?: string, style?: React.CSSProperties, classNames?:[QRCode\["classNames"\]](/components/qr-code#api), styles?: [QRCode\["styles"\]](/components/qr-code#api) } | - | 5.23.0 |
| transfer | Set Transfer common props | { className?: string, style?: React.CSSProperties, selectionsIcon?: React.ReactNode } | - | 5.7.0, selectionsIcon: 5.14.0 |
| tree | Set Tree common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| typography | Set Typography common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| upload | Set Upload common props | { className?: string, style?: React.CSSProperties } | - | 5.7.0 |
| wave | Config wave effect | { disabled?: boolean, showEffect?: (node: HTMLElement, info: { className, token, component }) => void } | - | 5.8.0 |

## FAQ

#### How to contribute a new language?

See [&lt;Adding new language&gt;](/docs/react/i18n#adding-newplanguage).

#### Date-related components locale is not working?

See FAQ [Date-related-components-locale-is-not-working?](/docs/react/faq#date-related-components-locale-is-not-working)

#### Modal throw error when setting `getPopupContainer`?

Related issue: <https://github.com/ant-design/ant-design/issues/19974>

When you config `getPopupContainer` to parentNode globally, Modal will throw error of `triggerNode is undefined` because it did not have a triggerNode. You can try the [fix](https://github.com/afc163/feedback-antd/commit/3e4d1ad1bc1a38460dc3bf3c56517f737fe7d44a) below.

```diff
 <ConfigProvider
-  getPopupContainer={triggerNode => triggerNode.parentNode}
+  getPopupContainer={node => {
+    if (node) {
+      return node.parentNode;
+    }
+    return document.body;
+  }}
 >
   <App />
 </ConfigProvider>
```

#### Why can't ConfigProvider props (like `prefixCls` and `theme`) affect ReactNode inside `message.info`, `notification.open`, `Modal.confirm`?

antd will dynamic create React instance by `ReactDOM.render` when call message methods. Whose context is different with origin code located context. We recommend `useMessage`, `useNotification` and `useModal` which , the methods came from `message/notification/Modal` has been deprecated in 5.x.

#### Locale is not working with Vite in production mode?

Related issue: [#39045](https://github.com/ant-design/ant-design/issues/39045)

In production mode of Vite, default exports from cjs file should be used like this: `enUS.default`. So you can directly import locale from `es/` directory like `import enUS from 'antd/es/locale/en_US'` to make dev and production have the same behavior.

#### `prefixCls` priority(The former is covered by the latter)

1. `ConfigProvider.config({ prefixCls: 'prefix-1' })`
2. `ConfigProvider.config({ holderRender: (children) => <ConfigProvider prefixCls="prefix-2">{children}</ConfigProvider> })`
3. `message.config({ prefixCls: 'prefix-3' })`
