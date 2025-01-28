---
category: Components
group: 数据展示
title: List
subtitle: 列表
description: 最基础的列表展示，可承载文字、列表、图片、段落。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EYuhSpw1iSwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tBzwQ7raKX8AAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用

最基础的列表展示，可承载文字、列表、图片、段落，常用于后台数据展示页面。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/simple.tsx">简单列表</code>
<code src="./demo/basic.tsx">基础列表</code>
<code src="./demo/loadmore.tsx">加载更多</code>
<code src="./demo/vertical.tsx">竖排列表样式</code>
<code src="./demo/pagination.tsx">分页设置</code>
<code src="./demo/grid.tsx">栅格列表</code>
<code src="./demo/grid-test.tsx" debug>测试栅格列表</code>
<code src="./demo/responsive.tsx">响应式的栅格列表</code>
<code src="./demo/infinite-load.tsx">滚动加载</code>
<code src="./demo/virtual-list.tsx">滚动加载无限长列表</code>
<code src="./demo/component-token.tsx" debug>自定义组件 token</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

另外我们封装了 [ProList](https://procomponents.ant.design/components/list)，在 `antd` List 之上扩展了更多便捷易用的功能，比如多选，展开等功能，使用体验贴近 Table，欢迎尝试使用。

### List

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bordered | 是否展示边框 | boolean | false |  |
| dataSource | 列表数据源 | any\[] | - |  |
| footer | 列表底部 | ReactNode | - |  |
| grid | 列表栅格配置 | [object](#list-grid-props) | - |  |
| header | 列表头部 | ReactNode | - |  |
| itemLayout | 设置 `List.Item` 布局，设置成 `vertical` 则竖直样式显示，默认横排 | string | - |  |
| loading | 当卡片内容还在加载中时，可以用 `loading` 展示一个占位 | boolean \| [object](/components/spin-cn#api) ([更多](https://github.com/ant-design/ant-design/issues/8659)) | false |  |
| loadMore | 加载更多 | ReactNode | - |  |
| locale | 默认文案设置，目前包括空数据文案 | object | {emptyText: `暂无数据`} |  |
| pagination | 对应的 `pagination` 配置，设置 false 不显示 | boolean \| object | false |  |
| renderItem | 当使用 dataSource 时，可以用 `renderItem` 自定义渲染列表项 | (item) => ReactNode | - |  |
| rowKey | 当 `renderItem` 自定义渲染列表项有效时，自定义每一行的 `key` 的获取方式 | `keyof` T \| (item: T) => `React.Key` | `"key"` |  |
| size | list 的尺寸 | `default` \| `large` \| `small` | `default` |  |
| split | 是否展示分割线 | boolean | true |  |
| styles | 语义化结构 style | Record<SemanticDOM, CSSProperties | - | 5.15.0 |

### pagination

分页的配置项。

| 参数     | 说明               | 类型                         | 默认值   |
| -------- | ------------------ | ---------------------------- | -------- |
| position | 指定分页显示的位置 | `top` \| `bottom` \| `both`  | `bottom` |
| align    | 指定分页对齐的位置 | `start` \| `center` \| `end` | `end`    |

更多配置项，请查看 [`Pagination`](/components/pagination-cn)。

### List grid props

| 参数   | 说明                 | 类型   | 默认值 | 版本 |
| ------ | -------------------- | ------ | ------ | ---- |
| column | 列数                 | number | -      |      |
| gutter | 栅格间隔             | number | 0      |      |
| xs     | `<576px` 展示的列数  | number | -      |      |
| sm     | `≥576px` 展示的列数  | number | -      |      |
| md     | `≥768px` 展示的列数  | number | -      |      |
| lg     | `≥992px` 展示的列数  | number | -      |      |
| xl     | `≥1200px` 展示的列数 | number | -      |      |
| xxl    | `≥1600px` 展示的列数 | number | -      |      |

### List.Item

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 列表操作组，根据 `itemLayout` 的不同，位置在卡片底部或者最右侧 | Array&lt;ReactNode> | - |  |
| classNames | 语义化结构 className | [`Record<actions \| extra, string>`](#semantic-dom) | - | 5.18.0 |
| extra | 额外内容，通常用在 `itemLayout` 为 `vertical` 的情况下，展示右侧内容; `horizontal` 展示在列表元素最右侧 | ReactNode | - |  |
| styles | 语义化结构 style | [`Record<actions \| extra, CSSProperties>`](#semantic-dom) | - | 5.18.0 |

### List.Item.Meta

| 参数        | 说明               | 类型      | 默认值 | 版本 |
| ----------- | ------------------ | --------- | ------ | ---- |
| avatar      | 列表元素的图标     | ReactNode | -      |      |
| description | 列表元素的描述内容 | ReactNode | -      |      |
| title       | 列表元素的标题     | ReactNode | -      |      |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="List"></ComponentTokenTable>
