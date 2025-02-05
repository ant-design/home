---
category: Components
group: 数据录入
title: Mentions
subtitle: 提及
description: 用于在输入中提及某人或某事。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e4bXT7Uhi9YAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*pxR2S53P_xoAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用

用于在输入中提及某人或某事，常用于发布、聊天或评论功能。

### 5.1.0 用法升级

<!-- prettier-ignore -->
:::info{title="升级提示"}
在 5.1.0 版本后，我们提供了 `<Mentions options={[...]} />` 的简写方式，有更好的性能和更方便的数据组织方式，开发者不再需要自行拼接 JSX。
同时我们废弃了原先的写法，你还是可以在 5.x 继续使用，但会在控制台看到警告，并会在 6.0 后移除。
:::

```jsx
// >=5.1.0 可用，推荐的写法 ✅
const options = [{ value: 'sample', label: 'sample' }];
return <Mentions options={options} />;

// <5.1.0 可用，>=5.1.0 时不推荐 🙅🏻‍♀️
return (
  <Mentions onChange={onChange}>
    <Mentions.Option value="sample">Sample</Mentions.Option>
  </Mentions>
);
```

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本使用</code>
<code src="./demo/variant.tsx" version="5.13.0">形态变体</code>
<code src="./demo/async.tsx">异步加载</code>
<code src="./demo/form.tsx">配合 Form 使用</code>
<code src="./demo/prefix.tsx">自定义触发字符</code>
<code src="./demo/readonly.tsx">无效或只读</code>
<code src="./demo/placement.tsx">向上展开</code>
<code src="./demo/allowClear.tsx">带移除图标</code>
<code src="./demo/autoSize.tsx">自动大小</code>
<code src="./demo/status.tsx">自定义状态</code>
<code src="./demo/onceDelete.tsx">一次删除</code>
<code src="./demo/render-panel.tsx" debug>_InternalPanelDoNotUseOrYouWillBeFired</code>
<code src="./demo/component-token.tsx" debug>组件 Token</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### Mentions

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 可以点击清除图标删除内容 | boolean \| { clearIcon?: ReactNode } | false | 5.13.0 |
| autoFocus | 自动获得焦点 | boolean | false |  |
| autoSize | 自适应内容高度，可设置为 true \| false 或对象：{ minRows: 2, maxRows: 6 } | boolean \| object | false |  |
| defaultValue | 默认值 | string | - |  |
| filterOption | 自定义过滤逻辑 | false \| (input: string, option: OptionProps) => boolean | - |  |
| getPopupContainer | 指定建议框挂载的 HTML 节点 | () => HTMLElement | - |  |
| notFoundContent | 当下拉列表为空时显示的内容 | ReactNode | `Not Found` |  |
| placement | 弹出层展示位置 | `top` \| `bottom` | `bottom` |  |
| prefix | 设置触发关键字 | string \| string\[] | `@` |  |
| split | 设置选中项前后分隔符 | string | ` ` |  |
| status | 设置校验状态 | 'error' \| 'warning' | - | 4.19.0 |
| validateSearch | 自定义触发验证逻辑 | (text: string, props: MentionsProps) => void | - |  |
| value | 设置值 | string | - |  |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 5.13.0 \| `underlined`: 5.24.0 |
| onBlur | 失去焦点时触发 | () => void | - |  |
| onChange | 值改变时触发 | (text: string) => void | - |  |
| onClear | 按下清除按钮的回调 | () => void | - | 5.20.0 |
| onFocus | 获得焦点时触发 | () => void | - |  |
| onResize | resize 回调 | function({ width, height }) | - |  |
| onSearch | 搜索时触发 | (text: string, prefix: string) => void | - |  |
| onSelect | 选择选项时触发 | (option: OptionProps, prefix: string) => void | - |  |
| onPopupScroll | 滚动时触发 | (event: Event) => void | - | 5.23.0 |
| options | 选项配置 | [Options](#option) | [] | 5.1.0 |
| itemOnceDelete | 支持一键清除 | boolean | false |  |  |

### Mentions 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

### Option

| 参数      | 说明           | 类型                | 默认值 |
| --------- | -------------- | ------------------- | ------ |
| value     | 选择时填充的值 | string              | -      |
| label     | 选项的标题     | React.ReactNode     | -      |
| key       | 选项的 key 值  | string              | -      |
| disabled  | 是否可选       | boolean             | -      |
| className | css 类名       | string              | -      |
| style     | 选项样式       | React.CSSProperties | -      |

## 主题变量（Design Token）

<ComponentTokenTable component="Mentions"></ComponentTokenTable>
