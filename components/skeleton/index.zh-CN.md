---
category: Components
group: 反馈
title: Skeleton
subtitle: 骨架屏
description: 在需要等待加载内容的位置提供一个占位图形组合。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*uae3QbkNCm8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*VcjGQLSrYdcAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用

- 网络较慢，需要长时间等待加载处理的情况下。
- 图文信息内容较多的列表/卡片中。
- 只在第一次加载数据的时候使用。
- 可以被 Spin 完全代替，但是在可用的场景下可以比 Spin 提供更好的视觉效果和用户体验。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/complex.tsx">复杂的组合</code>
<code src="./demo/active.tsx">动画效果</code>
<code src="./demo/element.tsx">按钮/头像/输入框/图像/自定义节点</code>
<code src="./demo/children.tsx">包含子组件</code>
<code src="./demo/list.tsx">列表</code>
<code src="./demo/componentToken.tsx" debug>自定义组件 Token</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### 共同的 API

<embed src="./shared/sharedProps.zh-CN.md"></embed>

### Skeleton

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| avatar | 是否显示头像占位图 | boolean \| [SkeletonAvatar](#skeletonavatar) | false |
| loading | 为 true 时，显示占位图。反之则直接展示子组件 | boolean | - |
| paragraph | 是否显示段落占位图 | boolean \| [SkeletonParagraphProps](#skeletonparagraphprops) | true |
| round | 为 true 时，段落和标题显示圆角 | boolean | false |
| title | 是否显示标题占位图 | boolean \| [SkeletonTitleProps](#skeletontitleprops) | true |

#### SkeletonTitleProps

| 属性  | 说明                 | 类型             | 默认值 |
| ----- | -------------------- | ---------------- | ------ |
| width | 设置标题占位图的宽度 | number \| string | -      |

#### SkeletonParagraphProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rows | 设置段落占位图的行数 | number | - |
| width | 设置段落占位图的宽度，若为数组时则为对应的每行宽度，反之则是最后一行的宽度 | number \| string \| Array&lt;number \| string> | - |

### Skeleton.Avatar

| 属性  | 说明                 | 类型                                      | 默认值    |
| ----- | -------------------- | ----------------------------------------- | --------- |
| shape | 指定头像的形状       | `circle` \| `square`                      | `circle`  |
| size  | 设置头像占位图的大小 | number \| `large` \| `small` \| `default` | `default` |

### Skeleton.Button

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| block | 将按钮宽度调整为其父宽度的选项 | boolean | false | 4.17.0 |
| shape | 指定按钮的形状 | `circle` \| `round` \| `square` \| `default` | - |  |
| size | 设置按钮的大小 | `large` \| `small` \| `default` | - |  |

### Skeleton.Input

| 属性 | 说明             | 类型                            | 默认值 |
| ---- | ---------------- | ------------------------------- | ------ |
| size | 设置输入框的大小 | `large` \| `small` \| `default` | -      |

## Semantic DOM

### Skeleton

<code src="./demo/_semantic.tsx" simplify="true"></code>

### Skeleton.Element

<code src="./demo/_semantic_element.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Skeleton"></ComponentTokenTable>
