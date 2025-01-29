---
category: Components
group: Data Display
title: Collapse
description: A content area which can be collapsed and expanded.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*B7HKR5OBe8gAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*sir-TK0HkWcAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use

- Can be used to group or hide complex regions to keep the page clean.
- `Accordion` is a special kind of `Collapse`, which allows only one panel to be expanded at a time.

```tsx | pure
// works when >= 5.6.0, recommended ✅
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
  },
];

<Collapse items={items} defaultActiveKey={['1']} />;

// works when <5.6.0 , deprecated when >=5.6.0  🙅🏻‍♀️

<Collapse defaultActiveKey={['1']} onChange={onChange}>
  <Panel header="This is panel header 1" key="1">
    <p>{text}</p>
  </Panel>
  <Panel header="This is panel header 2" key="2">
    <p>{text}</p>
  </Panel>
  <Panel header="This is panel header 3" key="3">
    <p>{text}</p>
  </Panel>
</Collapse>;
```

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Collapse</code>
<code src="./demo/size.tsx">Size</code>
<code src="./demo/accordion.tsx">Accordion</code>
<code src="./demo/mix.tsx">Nested panel</code>
<code src="./demo/borderless.tsx">Borderless</code>
<code src="./demo/custom.tsx">Custom Panel</code>
<code src="./demo/noarrow.tsx">No arrow</code>
<code src="./demo/extra.tsx">Extra node</code>
<code src="./demo/ghost.tsx">Ghost Collapse</code>
<code src="./demo/collapsible.tsx">Collapsible</code>
<code src="./demo/component-token.tsx" debug>Component Token</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### Collapse

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| accordion | If true, Collapse renders as Accordion | boolean | false |  |
| activeKey | Key of the active panel | string\[] \| string <br/> number\[] \| number | No default value. In [accordion mode](#collapse-demo-accordion), it's the key of the first panel |  |
| bordered | Toggles rendering of the border around the collapse block | boolean | true |  |
| collapsible | Specify how to trigger Collapse. Either by clicking icon or by clicking any area in header or disable collapse functionality itself | `header` \| `icon` \| `disabled` | - | 4.9.0 |
| defaultActiveKey | Key of the initial active panel | string\[] \| string <br/> number\[] \| number | - |  |
| destroyInactivePanel | Destroy Inactive Panel | boolean | false |  |
| expandIcon | Allow to customize collapse icon | (panelProps) => ReactNode | - |  |
| expandIconPosition | Set expand icon position | `start` \| `end` | - | 4.21.0 |
| expandIconVerticalPosition | Set expand icon vertical position | `start` \| `center` \| `end` | - |  |
| ghost | Make the collapse borderless and its background transparent | boolean | false | 4.4.0 |
| size | Set the size of collapse | `large` \| `middle` \| `small` | `middle` | 5.2.0 |
| onChange | Callback function executed when active panel is changed | function | - |  |
| items | collapse items content | [ItemType](#itemtype) | - | 5.6.0 |

### ItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Semantic structure className | [`Record<header \| body, string>`](#semantic-dom) | - | 5.21.0 |
| collapsible | Specify whether the panel be collapsible or the trigger area of collapsible | `header` \| `icon` \| `disabled` | - |  |
| children | Body area content | ReactNode | - |  |
| extra | The extra element in the corner | ReactNode | - |  |
| forceRender | Forced render of content on panel, instead of lazy rendering after clicking on header | boolean | false |  |
| key | Unique key identifying the panel from among its siblings | string \| number | - |  |
| label | Title of the panel | ReactNode | - | - |
| showArrow | If false, panel will not show arrow icon. If false, collapsible can't be set as icon | boolean | true |  |
| styles | Semantic DOM style | [`Record<header \| body, CSSProperties>`](#semantic-dom) | - | 5.21.0 |

### Collapse.Panel

<!-- prettier-ignore -->
:::info{title=Deprecated}
When using version >= 5.6.0, we prefer to configuring the panel by `items`.
:::

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| collapsible | Specify whether the panel be collapsible or the trigger area of collapsible | `header` \| `icon` \| `disabled` | - | 4.9.0 (icon: 4.24.0) |
| extra | The extra element in the corner | ReactNode | - |  |
| forceRender | Forced render of content on panel, instead of lazy rendering after clicking on header | boolean | false |  |
| header | Title of the panel | ReactNode | - |  |
| key | Unique key identifying the panel from among its siblings | string \| number | - |  |
| showArrow | If false, panel will not show arrow icon. If false, collapsible can't be set as icon | boolean | true |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Collapse"></ComponentTokenTable>
