---
category: Components
group: Data Entry
title: Rate
description: Used for rating operation on something.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*oyOcTrB12_YAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*M7_ER7GJr6wAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use

- Show evaluation.
- A quick rating operation on something.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/half.tsx">Half star</code>
<code src="./demo/text.tsx">Show copywriting</code>
<code src="./demo/disabled.tsx">Read only</code>
<code src="./demo/clear.tsx">Clear star</code>
<code src="./demo/character.tsx">Other Character</code>
<code src="./demo/character-function.tsx">Customize character</code>
<code src="./demo/component-token.tsx" debug>Component Token</code>

## API

Common props ref：[Common props](/docs/react/common-props)

| Property | Description | type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Whether to allow clear when click again | boolean | true |  |
| allowHalf | Whether to allow semi selection | boolean | false |  |
| autoFocus | If get focus when component mounted | boolean | false |  |
| character | The custom character of rate | ReactNode \| (RateProps) => ReactNode | &lt;StarFilled /> | function(): 4.4.0 |
| className | The custom class name of rate | string | - |  |
| count | Star count | number | 5 |  |
| defaultValue | The default value | number | 0 |  |
| disabled | If read only, unable to interact | boolean | false |  |
| keyboard | Support keyboard operation | boolean | true | 5.18.0 |
| style | The custom style object of rate | CSSProperties | - |  |
| tooltips | Customize tooltip by each character | string\[] | - |  |
| tooltipProps | Tooltips property | [TooltipProps](/components/tooltip-cn#api) | - |  |
| value | The current value | number | - |  |
| onBlur | Callback when component lose focus | function() | - |  |
| onChange | Callback when select value | function(value: number) | - |  |
| onFocus | Callback when component get focus | function() | - |  |
| onHoverChange | Callback when hover item | function(value: number) | - |  |
| onKeyDown | Callback when keydown on component | function(event) | - |  |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

## Design Token

<ComponentTokenTable component="Rate"></ComponentTokenTable>
