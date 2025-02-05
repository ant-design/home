---
category: Components
title: Badge
description: Small numerical value or status descriptor for UI elements.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e0qITYqF394AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*v8EQT7KoGbcAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group: Data Display
---

## When To Use

Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/no-wrapper.tsx">Standalone</code>
<code src="./demo/overflow.tsx">Overflow Count</code>
<code src="./demo/dot.tsx">Red badge</code>
<code src="./demo/change.tsx">Dynamic</code>
<code src="./demo/link.tsx">Clickable</code>
<code src="./demo/offset.tsx">Offset</code>
<code src="./demo/size.tsx">Size</code>
<code src="./demo/status.tsx">Status</code>
<code src="./demo/colorful.tsx">Colorful Badge</code>
<code src="./demo/ribbon.tsx">Ribbon</code>
<code src="./demo/ribbon-debug.tsx" debug>Ribbon Debug</code>
<code src="./demo/mix.tsx" debug>Mixed usage</code>
<code src="./demo/title.tsx" debug>Title</code>
<code src="./demo/colorful-with-count-debug.tsx" debug>Colorful Badge support count Debug</code>
<code src="./demo/component-token.tsx" debug>Component Token</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### Badge

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Customize Badge dot color | string | - |  |
| count | Number to show in badge | ReactNode | - |  |
| classNames | Semantic DOM class | [Record<SemanticDOM, string>](#semantic-dom) | - | 5.7.0 |
| dot | Whether to display a red dot instead of `count` | boolean | false |  |
| offset | Set offset of the badge dot | \[number, number] | - |  |
| overflowCount | Max count to show | number | 99 |  |
| showZero | Whether to show badge when `count` is zero | boolean | false |  |
| size | If `count` is set, `size` sets the size of badge | `default` \| `small` | - | - |
| status | Set Badge as a status dot | `success` \| `processing` \| `default` \| `error` \| `warning` | - |  |
| statusTitle | Sets the text displayed when hovering over the status dot. Effective only when status is set. | string | - |
| styles | Semantic DOM style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - | 5.7.0 |
| text | If `status` is set, `text` sets the display text of the status `dot` | ReactNode | - |  |
| title | Text to show when hovering over the badge | string | - |  |

### Badge.Ribbon

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Customize Ribbon color | string | - |  |
| placement | The placement of the Ribbon, `start` and `end` follow text direction (RTL or LTR) | `start` \| `end` | `end` |  |
| text | Content inside the Ribbon | ReactNode | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Badge"></ComponentTokenTable>
