---
category: Components
group: 数据录入
title: Rate
subtitle: 评分
description: 用于对事物进行评分操作。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*oyOcTrB12_YAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*M7_ER7GJr6wAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用

- 对评价进行展示。
- 对事物进行快速的评级操作。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/half.tsx">半星</code>
<code src="./demo/text.tsx">文案展现</code>
<code src="./demo/disabled.tsx">只读</code>
<code src="./demo/clear.tsx">清除</code>
<code src="./demo/character.tsx">其他字符</code>
<code src="./demo/character-function.tsx">自定义字符</code>
<code src="./demo/component-token.tsx" debug>组件 Token</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 是否允许再次点击后清除 | boolean | true |  |
| allowHalf | 是否允许半选 | boolean | false |  |
| autoFocus | 自动获取焦点 | boolean | false |  |
| character | 自定义字符 | ReactNode \| (RateProps) => ReactNode | &lt;StarFilled /> | function(): 4.4.0 |
| className | 自定义样式类名 | string | - |  |
| count | star 总数 | number | 5 |  |
| defaultValue | 默认值 | number | 0 |  |
| disabled | 只读，无法进行交互 | boolean | false |  |
| keyboard | 支持使用键盘操作 | boolean | true | 5.18.0 |
| style | 自定义样式对象 | CSSProperties | - |  |
| tooltips | 自定义每项的提示信息 | string\[] | - |  |
| tooltipProps | Tooltips属性 | [TooltipProps](/components/tooltip-cn#api) | - |  |
| value | 当前数，受控值 | number | - |  |
| onBlur | 失去焦点时的回调 | function() | - |  |
| onChange | 选择时的回调 | function(value: number) | - |  |
| onFocus | 获取焦点时的回调 | function() | - |  |
| onHoverChange | 鼠标经过时数值变化的回调 | function(value: number) | - |  |
| onKeyDown | 按键回调 | function(event) | - |  |

## 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

## 主题变量（Design Token）

<ComponentTokenTable component="Rate"></ComponentTokenTable>
