---
category: Components
title: AutoComplete
subtitle: 自动完成
description: 输入框自动完成功能。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*g8THS4NpV6sAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WERTQ6qvgEYAAAAAAAAAAAAADrJ8AQ/original
group:
  title: 数据录入
  order: 4
demo:
  cols: 2
---

## 何时使用

- 需要一个输入框而不是选择器。
- 需要输入建议/辅助提示。

和 Select 的区别是：

- AutoComplete 是一个带提示的文本输入框，用户可以自由输入，关键词是辅助**输入**。
- Select 是在限定的可选项中进行选择，关键词是**选择**。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本使用</code>
<code src="./demo/options.tsx">自定义选项</code>
<code src="./demo/custom.tsx">自定义输入组件</code>
<code src="./demo/non-case-sensitive.tsx">不区分大小写</code>
<code src="./demo/certain-category.tsx">查询模式 - 确定类目</code>
<code src="./demo/uncertain-category.tsx">查询模式 - 不确定类目</code>
<code src="./demo/status.tsx">自定义状态</code>
<code src="./demo/variant.tsx" version="5.13.0">多种形态</code>
<code src="./demo/allowClear.tsx">自定义清除按钮</code>
<code src="./demo/form-debug.tsx" debug>在 Form 中 Debug</code>
<code src="./demo/render-panel.tsx" debug>\_InternalPanelDoNotUseOrYouWillBeFired</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 支持清除 | boolean \| { clearIcon?: ReactNode } | false | 5.8.0: 支持对象形式 |
| autoAdjustOverflow | 下拉框被遮挡时自动调整位置 | boolean | true | 5.24.0 |
| autoFocus | 自动获取焦点 | boolean | false |  |
| backfill | 使用键盘选择选项的时候把选中项回填到输入框中 | boolean | false |  |
| children (自动完成的数据源) | 自动完成的数据源，不能和自定义输入框同时配置 | React.ReactElement&lt;OptionProps> \| Array&lt;React.ReactElement&lt;OptionProps>> | - |  |
| children (自定义输入框) | 自定义输入框，不能和自动完成的数据源同时配置 | HTMLInputElement \| HTMLTextAreaElement \| React.ReactElement&lt;InputProps> | &lt;Input /> |  |
| defaultActiveFirstOption | 是否默认高亮第一个选项 | boolean | true |  |
| defaultOpen | 是否默认展开下拉菜单 | boolean | - |  |
| defaultValue | 指定默认选中的条目 | string | - |  |
| disabled | 是否禁用 | boolean | false |  |
| dropdownRender | 自定义下拉框内容 | (menus: ReactNode) => ReactNode | - | 4.24.0 |
| popupClassName | 下拉菜单的 className 属性 | string | - | 4.23.0 |
| popupMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动 | boolean \| number | true |  |
| filterOption | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 true，反之则返回 false | boolean \| function(inputValue, option) | true |  |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。[示例](https://codesandbox.io/s/4j168r7jw0) | function(triggerNode) | () => document.body |  |
| notFoundContent | 当下拉列表为空时显示的内容 | ReactNode | - |  |
| open | 是否展开下拉菜单 | boolean | - |  |
| options | 数据化配置选项内容，相比 jsx 定义会获得更好的渲染性能 | { label, value }\[] | - |  |
| placeholder | 输入框提示 | string | - |  |
| status | 设置校验状态 | 'error' \| 'warning' | - | 4.19.0 |
| size | 控件大小 | `large` \| `middle` \| `small` | - |  |
| value | 指定当前选中的条目 | string | - |  |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` | `outlined` | 5.13.0 |
| virtual | 设置 false 时关闭虚拟滚动 | boolean | true | 4.1.0 |
| onBlur | 失去焦点时的回调 | function() | - |  |
| onChange | 选中 option，或 input 的 value 变化时，调用此函数 | function(value) | - |  |
| onDropdownVisibleChange | 展开下拉菜单的回调 | function(open) | - |  |
| onFocus | 获得焦点时的回调 | function() | - |  |
| onSearch | 搜索补全项的时候调用 | function(value) | - |  |
| onSelect | 被选中时调用，参数为选中项的 value 值 | function(value, option) | - |  |
| onClear | 清除内容时的回调 | function | - | 4.6.0 |
| onInputKeyDown | 按键按下时回调 | (event: KeyboardEvent) => void | - |  |
| onPopupScroll | 下拉列表滚动时的回调 | (event: UIEvent) => void | - |  |

## 方法

| 名称    | 描述     | 版本 |
| ------- | -------- | ---- |
| blur()  | 移除焦点 |      |
| focus() | 获取焦点 |      |

## 主题变量（Design Token）

<ComponentTokenTable component="Select"></ComponentTokenTable>

## FAQ

### 为何受控状态下使用 onSearch 无法输入中文？

请使用 `onChange` 进行受控管理。`onSearch` 触发于搜索输入，与 `onChange` 时机不同。此外，点击选项时也不会触发 `onSearch` 事件。

相关 issue：[#18230](https://github.com/ant-design/ant-design/issues/18230) [#17916](https://github.com/ant-design/ant-design/issues/17916)

### 为何 options 为空时，受控 open 展开不会显示下拉菜单？

AutoComplete 组件本质上是 Input 输入框的一种扩展，当 `options` 为空时，显示空文本会让用户误以为该组件不可操作，实际上它仍然可以进行文本输入操作。因此，为了避免给用户带来困惑，当 `options` 为空时，`open` 属性为 `true` 也不会展示下拉菜单，需要与 `options` 属性配合使用。
