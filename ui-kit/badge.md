---
layout: uikit-single
title: Badge
slug: badges
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---

## Overview
The `VBadge` component is a versatile and customizable badge element built using ShadCN Vue [library](https://www.shadcn-vue.com/docs/components/badge.html). It allows you to display labels in various styles, typically used for notifications, counters, or status indicators. The badge's appearance can be easily controlled through props for size, color, and other states.

## Key Features:
- **Customizable Size**: The badge can be rendered in two sizes (`small` or `medium`), allowing flexibility in different contexts.
- **Color Variants**: Choose from multiple color options (`primary`, `secondary`, `secondary-light`) to suit your design.
- **Active State**: You can activate the badge's active state with the `isActive` prop, changing its appearance for emphasis.
- **Hover Effect**: The `hover` prop adds a hover effect, providing an interactive feel for the badge.
  
The `VBadge` component is located in the `ui-kit/src/components/VBadge` folder.


## Props
- **`size`** (`'medium' | 'small'`, default: `'medium'`): 
  - Defines the size of the badge.
  - `'medium'`: Larger padding and text size.
  - `'small'`: Smaller padding and text size.
  
- **`color`** (`'primary' | 'secondary' | 'secondary-light'`): 
  - Controls the background color of the badge.
  - `'primary'`: Blue-colored background, white text.
  - `'secondary'`: Gray-colored background, darker text when active or hovered.
  - `'secondary-light'`: Lighter gray background, transitioning to a darker shade on hover or active state.

- **`isActive`** (`boolean`, default: `false`): 
  - Activates the badge, changing its background color to a darker shade.

- **`hover`** (`boolean`, default: `false`): 
  - Enables hover effects, changing the background color when the badge is hovered.

## Usage
The `VBadge` component is used to display badges with different properties, and it's highly customizable through the available props. Here’s an example of how to use it:

```vue
<script setup lang="ts">
import VBadge from 'UiKit/components/VBadge/VBadge.vue';
</script>

<template>
  <VBadge
    size="medium"
    color="primary"
    :isActive="true"
    :hover="true"
  >
    New
  </VBadge>
</template>
```
In this example, the badge has a medium size, primary color, an active state, and a hover effect.

## Styling
The badge’s design is highly customizable with the following CSS classes:

- **`is--size-medium`**: Applies medium size with larger padding and font weight.
- **`is--size-small`**: Applies smaller size with reduced padding and lighter font weight.
- **`is--badge-color-primary`**: Applies the primary color for the badge.
- **`is--badge-color-secondary`**: Applies the secondary color for the badge.
- **`is--badge-color-secondary-light`**: Applies the secondary light color for the badge.
- **`is--hover`**: Enables hover effects on the badge.
- **`is--active`**: Activates the badge, changing the background color when active.

## Example
```vue
<script setup lang="ts">
import VBadge from 'UiKit/components/VBadge/VBadge.vue';
</script>

<template>
  <VBadge
    size="small"
    color="secondary"
    isActive
  >
    Updated
  </VBadge>
  <VBadge
    size="medium"
    color="secondary-light"
    hover
  >
    New Feature
  </VBadge>
</template>
```

#### Sizes
<script setup lang="ts">
import VBadge from 'UiKit/components/Base/VBadge/VBadge.vue';
import VBadgeClickToBlog from 'UiKit/components/VBadge/VBadgeClickToBlog.vue';
import VBadgeClickToBlogInline from 'UiKit/components/VBadge/VBadgeClickToBlogInline.vue';

const dataInline = ['badge1', 'badge2', 'badge3']
</script>

<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
  <VBadge
    size="small"
    color="secondary-light"
  >
    Small
  </VBadge>
  <VBadge
    size="medium"
    color="secondary-light"
  >
    Medium
  </VBadge>
</div>

#### Hover
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
  <VBadge
    color="secondary-light"
    hover
  >
    Medium
  </VBadge>
</div>

#### Active
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
  <VBadge
    color="secondary-light"
    is-active
  >
    Medium
  </VBadge>
</div>

#### Color 
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;flex-wrap: wrap;">
  <VBadge
    color="secondary-light"
    hover
  >
    Secondary light
  </VBadge>
  <VBadge
    color="primary"
    hover
  >
    Primary
  </VBadge>
  <VBadge
    color="secondary"
    hover
  >
    Secondary
  </VBadge>
  <VBadge
    color="red"
    hover
  >
    red
  </VBadge>
  <VBadge
    color="yellow"
    hover
  >
    yellow
  </VBadge>
  <VBadge
    color="red-light"
    hover
  >
    red light
  </VBadge>
  <VBadge
    color="yellow-light"
    hover
  >
    yellow light
  </VBadge>
  <VBadge
    color="purple-light"
    hover
  >
    purple light
  </VBadge>
  <VBadge
    color="tetriary"
    hover
  >
    tetriary
  </VBadge>
  <VBadge
    color="tetriary-light"
    hover
  >
    tetriary light
  </VBadge>
</div>

## Additional Usage
The VBadge component also includes predefined variations to suit specific use cases. These variations extend the functionality of VBadge while maintaining consistency across the project. Below are two predefined components you can find in the ui-kit/src/components/VBadge directory:

### VBadgeClickToBlog
This component simplifies the creation of badges that redirect users to a blog page filtered by a specific tag.

#### Props:
- `text`(required): The text to be displayed on the badge.

#### Features:
- Default color: `secondary-light`.
- Includes a hover effect for interactivity.
- Clicking the badge redirects to a blog page with the relevant tag filter applied.

#### Example
<VBadgeClickToBlog
  text="Click to blog"
/>

### VBadgeClickToBlogInline
This component allows you to display multiple VBadgeClickToBlog components inline, using a predefined style that ensures consistency with the rest of the project.

#### Props:
- `data`(required): An array of strings, where each string represents the text of an individual badge.

#### Features:
- Displays a list of badges in a horizontal row.
- Each badge inherits the `VBadgeClickToBlog` functionality, including hover effects and redirection to the blog page.


#### Example
<VBadgeClickToBlogInline
  :data="dataInline"
/>
