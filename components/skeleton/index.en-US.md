---
category: Components
group: Feedback
title: Skeleton
description: Provide a placeholder while you wait for content to load, or to visualize content that doesn't exist yet.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*uae3QbkNCm8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*VcjGQLSrYdcAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use

- When a resource needs long time to load.
- When the component contains lots of information, such as List or Card.
- Only works when loading data for the first time.
- Could be replaced by Spin in any situation, but can provide a better user experience.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/complex.tsx">Complex combination</code>
<code src="./demo/active.tsx">Active Animation</code>
<code src="./demo/element.tsx">Button/Avatar/Input/Image/Node</code>
<code src="./demo/children.tsx">Contains sub component</code>
<code src="./demo/list.tsx">List</code>
<code src="./demo/componentToken.tsx" debug>Custom component token</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### Common API

<embed src="./shared/sharedProps.en-US.md"></embed>

### Skeleton

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| active | Show animation effect | boolean | false |
| avatar | Show avatar placeholder | boolean \| [SkeletonAvatarProps](#skeletonavatarprops) | false |
| loading | Display the skeleton when true | boolean | - |
| paragraph | Show paragraph placeholder | boolean \| [SkeletonParagraphProps](#skeletonparagraphprops) | true |
| round | Show paragraph and title radius when true | boolean | false |
| title | Show title placeholder | boolean \| [SkeletonTitleProps](#skeletontitleprops) | true |

#### SkeletonTitleProps

| Property | Description            | Type             | Default |
| -------- | ---------------------- | ---------------- | ------- |
| width    | Set the width of title | number \| string | -       |

#### SkeletonParagraphProps

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| rows | Set the row count of paragraph | number | - |
| width | Set the width of paragraph. When width is an Array, it can set the width of each row. Otherwise only set the last row width | number \| string \| Array&lt;number \| string> | - |

### Skeleton.Avatar

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| active | Show animation effect, only valid when used avatar independently | boolean | false |
| shape | Set the shape of avatar | `circle` \| `square` | `circle` |
| size | Set the size of avatar | number \| `large` \| `small` \| `default` | `default` |

### Skeleton.Button

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| active | Show animation effect | boolean | false |  |
| block | Option to fit button width to its parent width | boolean | false | 4.17.0 |
| shape | Set the shape of button | `circle` \| `round` \| `square` \| `default` | - |  |
| size | Set the size of button | `large` \| `small` \| `default` | - |  |

### Skeleton.Input

| Property | Description           | Type                            | Default |
| -------- | --------------------- | ------------------------------- | ------- |
| active   | Show animation effect | boolean                         | false   |
| size     | Set the size of input | `large` \| `small` \| `default` | -       |

## Semantic DOM

### Skeleton

<code src="./demo/_semantic.tsx" simplify="true"></code>

### Skeleton.Element

<code src="./demo/_semantic_element.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Skeleton"></ComponentTokenTable>
