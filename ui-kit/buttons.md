---
layout: uikit-single
title: Button
slug: button
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---
## Location
```src/core/ui/button```

## Usage
To add the `VButton` component, start by importing it into your Vue file:
```vue
import VButton from 'UiKit/components/VButton';
```
#### Example
Place the component in your template like this:
```vue
<VButton
    size="large"
    color="primary"
    :loading="isLoading"
>
    Click Me
</VButton>
```
- `size`: Defines the button size (large, medium, small, or x-small).
- `color`: Defines the button color (primary, secondary, success, warning, or danger).
- `loading`: A boolean prop that shows a spinner when true.

## Component Props
```ts
defineProps({
  as: {
    type: String as PropType<'button' | 'a' | 'router-link'>,
    default: 'button',
  },
  size: {
    type: String as PropType<'large' | 'medium' | 'small'>,
    default: 'medium',
  },
  variant: String,
  color: {
    type: String as PropType<'primary' | 'secondary'>,
    default: 'primary',
  },
  block: Boolean,
  disabled: Boolean,
  loading: Boolean,
  squared: Boolean,
  iconOnly: Boolean,
});
```

- `as`: Defines the HTML element to render (button, a, or router-link). Default is button.
- `size`: Controls the button's size, which can be large, medium, small, or x-small.
- `variant`: (Optional) Defines the button variant (outlined, link).
- `color`: Sets the button's color, with options including primary, secondary, success, warning, and danger.
- `block`: (Optional) If true, the button will take the full width of its container.
- `disabled`: (Optional) If true, the button will be disabled.
- `loading`: (Optional) If true, the button will display a spinner.
- `squared`: (Optional) If true, the button will have squared corners.
- `iconOnly`: (Optional) If true, the button will only display an icon, with no text.

## Icon Customization
To include icons, use the `iconOnly` prop and the `iconPlacement` prop to control the icon's display. For example, to show an icon to the left of the text:
``` vue
<VButton
    iconOnly
    iconPlacement="left"
    color="primary"
>
    <svg>...</svg>  <!-- Replace with your icon -->
</VButton>
```

## Complete Example
Here’s a complete example showcasing a button that handles loading state and displays a spinner:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import VButton from 'UiKit/components/VButton';
import plusIcon from 'UiKit/assets/images/plus.svg?component';
import ArrowRight from 'UiKit/assets/images/arrow-right.svg';
import VSvgInline from 'UiKit/components/VSvgInline.vue';


const isLoading = ref(false);

function handleButtonClick() {
    isLoading.value = true;
    // Simulate an API call
    setTimeout(() => {
        isLoading.value = false;
    }, 2000);
}
</script>

<template>
  <VButton
      size="large"
      color="primary"
      :loading="isLoading"
      @click="handleButtonClick"
  >
      Submit
  </VButton>
</template>
```


## Examples
#### Size
<script setup lang="ts">
import plusIcon from 'UiKit/assets/images/plus.svg?component';
</script>

<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
<VButton size="large" >
Large
</VButton>
<VButton size="medium" >
Regular
</VButton>
<VButton size="small" >
Small
</VButton>
</div>

#### Variant
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
<VButton >
Default
</VButton>
<VButton variant="outlined" >
Outlined
</VButton>
<VButton variant="link" >
Ghost
</VButton>
<VButton variant="tetriary" >
Tetriary
</VButton>
</div>

#### Color
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
<VButton >
Primary
</VButton>
<VButton color="secondary" >
Secondary
</VButton>
<VButton color="tetriary" >
Tetriary
</VButton>
</div>

#### Color variant outlined
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
<VButton  variant="outlined" >
Primary
</VButton>
<VButton color="secondary" variant="outlined" >
Secondary
</VButton>
<VButton color="tetriary" variant="outlined" >
Tetriary
</VButton>
</div>


#### Color variant link
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
<VButton  variant="link" >
Primary
</VButton>
<VButton color="secondary" variant="link" >
Secondary
</VButton>
<VButton color="tetriary" variant="link" >
Tetriary
</VButton>
</div>


#### Block
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
<VButton block >
Button
</VButton>
</div>

#### Disabled
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
<VButton disabled >
Primary
</VButton>
<VButton color="secondary" disabled >
Secondary
</VButton>
<VButton color="tetriary" disabled >
Tetriary
</VButton>
</div>


#### Loading
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
<VButton loading >
Button
</VButton>
</div>


#### Squared
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
<VButton squared >
Button
</VButton>
</div>


#### Icon
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
<VButton >
  Icon
  <component :is="plusIcon" />
</VButton>
</div>

#### Icon only
<div style="gap: 20px;display: flex;align-items: center;margin-bottom: 20px;">
<VButton icon-only >
  <component :is="plusIcon" />
</VButton>
<VButton color="secondary" icon-only >
  <component :is="plusIcon" />
</VButton>
<VButton color="tetriary" icon-only >
  <component :is="plusIcon" />
</VButton>
</div>