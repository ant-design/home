---
category: Components
group: 数据展示
title: Statistic
subtitle: 统计数值
description: 展示统计数值。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YL7PRYNtH-4AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*BPWDRbSYxJ4AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用

- 当需要突出某个或某组数字时。
- 当需要展示带描述的统计类数据时使用。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/unit.tsx">单位</code>
<code src="./demo/animated.tsx">动画效果</code>
<code src="./demo/card.tsx" background="grey">在卡片中使用</code>
<code src="./demo/countdown.tsx">倒计时</code>
<code src="./demo/component-token.tsx" debug>组件 Token</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

#### Statistic

| 参数             | 说明               | 类型                 | 默认值 | 版本  |
| ---------------- | ------------------ | -------------------- | ------ | ----- |
| decimalSeparator | 设置小数点         | string               | `.`    |       |
| formatter        | 自定义数值展示     | (value) => ReactNode | -      |       |
| groupSeparator   | 设置千分位标识符   | string               | `,`    |       |
| loading          | 数值是否加载中     | boolean              | false  | 4.8.0 |
| precision        | 数值精度           | number               | -      |       |
| prefix           | 设置数值的前缀     | ReactNode            | -      |       |
| suffix           | 设置数值的后缀     | ReactNode            | -      |       |
| title            | 数值的标题         | ReactNode            | -      |       |
| value            | 数值内容           | string \| number     | -      |       |
| valueStyle       | 设置数值区域的样式 | CSSProperties        | -      |       |

#### Statistic.Countdown

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| format | 格式化倒计时展示，参考 [dayjs](https://day.js.org/) | string | `HH:mm:ss` |  |
| prefix | 设置数值的前缀 | ReactNode | - |  |
| suffix | 设置数值的后缀 | ReactNode | - |  |
| title | 数值的标题 | ReactNode | - |  |
| value | 数值内容 | number | - |  |
| valueStyle | 设置数值区域的样式 | CSSProperties | - |  |
| isPaused | 设置倒计时是否暂停 | boolean | false |  |
| onFinish | 倒计时完成时触发 | () => void | - |  |
| onChange | 倒计时时间变化时触发 | (value: number) => void | - | 4.16.0 |

## 主题变量（Design Token）

<ComponentTokenTable component="Statistic"></ComponentTokenTable>
