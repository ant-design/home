---
category: Components
title: QRCode
description: Components that can convert text into QR codes, and support custom color and logo.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*cJopQrf0ncwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*M4PBTZ_n9OgAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group:
  title: Data Display
  order: 5
tag: 5.1.0
---

## When To Use

Used when the text needs to be converted into a QR Code.

## Examples

<!-- prettier-ignore -->
<code src="./demo/base.tsx">base</code>
<code src="./demo/icon.tsx">With Icon</code>
<code src="./demo/status.tsx">other status</code>
<code src="./demo/customStatusRender.tsx" version="5.20.0">custom status render</code>
<code src="./demo/type.tsx">Custom Render Type</code>
<code src="./demo/customSize.tsx">Custom Size</code>
<code src="./demo/customColor.tsx">Custom Color</code>
<code src="./demo/download.tsx">Download QRCode</code>
<code src="./demo/errorlevel.tsx">Error Level</code>
<code src="./demo/Popover.tsx">Advanced Usage</code>

## API

Common props ref：[Common props](/docs/react/common-props)

> This component is available since `antd@5.1.0`

| Property | Description | Type | Default | Version |
| :-- | :-- | :-- | :-- | :-- |
| value | scanned text | string | - |
| type | render type | `canvas \| svg ` | `canvas` | 5.6.0 |
| icon | include image url (only image link are supported) | string | - |
| size | QRCode size | number | 160 |
| iconSize | include image size | number \| { width: number; height: number } | 40 | 5.19.0 |
| color | QRCode Color | string | `#000` |
| bgColor | QRCode Background Color | string | `transparent` | 5.5.0 |
| bordered | Whether has border style | boolean | `true` |
| errorLevel | Error Code Level | `'L' \| 'M' \| 'Q' \| 'H' ` | `M` |
| status | QRCode status | `active \| expired \| loading \| scanned` | `active` | scanned: 5.13.0 |
| statusRender | custom status render | `(info: \[StatusRenderInfo](/components/qr-code-cn#statusrenderinfo)) => React.ReactNode` | 5.20.0 |
| onRefresh | callback | `() => void` | - |

### StatusRenderInfo

```typescript
type StatusRenderInfo = {
  status: QRStatus;
  locale: Locale['QRCode'];
  onRefresh?: () => void;
};
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="QRCode"></ComponentTokenTable>

## FAQ

### About QRCode ErrorLevel

The ErrorLevel means that the QR code can be scanned normally after being blocked, and the maximum area that can be blocked is the error correction rate.

Generally, the QR code is divided into 4 error correction levels: Level `L` can correct about `7%` errors, Level `M` can correct about `15%` errors, Level `Q` can correct about `25%` errors, and Level `H` can correct about `30%` errors. When the content encoding of the QR code carries less information, in other words, when the value link is short, set different error correction levels, and the generated image will not change.

> For more information, see the: [https://www.qrcode.com/en/about/error_correction](https://www.qrcode.com/en/about/error_correction.html)

### ⚠️⚠️⚠️ Cannot scan the QR code?

If the QR code cannot be scanned for identification, it may be because the link address is too long, which leads to too dense pixels.

You can configure the QR code to be larger through size, or shorten the link through short link services.
