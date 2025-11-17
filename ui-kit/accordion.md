---
layout: uikit-single
title: Accordion
slug: accordion
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---
## Overview
The `VAccordion` component is a flexible and highly customizable accordion element built using the ShadCN Vue library ([official documentation](https://www.shadcn-vue.com/docs/components/accordion.html)). It allows you to create collapsible and expandable sections, making it ideal for displaying content like FAQ lists, dropdowns, and structured information in an interactive way.

This component is composed of several subcomponents, each with a specific role in managing different parts of the accordion:

- **`AccordionRoot`**: The root container that wraps the entire accordion.
- **`AccordionItem`**: Represents a single item in the accordion, containing both a header and content.
- **`AccordionHeader`**: The header section that contains the title and trigger button.
- **`AccordionTrigger`**: The clickable element that controls the open/close state of the accordion item.
- **`AccordionContent`**: The content section that appears or disappears based on the expanded state of the accordion item.

These components are located in the path: `ui-kit/src/components/Base/VAccordion`.

## Props
The `VAccordion` component inherits props from the ShadCN library, which offers flexibility to control various aspects of the accordion's behavior. You can find a complete list of the props in the official [ShadCN documentation](https://www.shadcn-vue.com/docs/components/accordion.html).

Additionally, the `VAccordionTrigger` component includes a custom prop that is specific to the UiKit integration:
- **`isWhite`**: A prop that modifies the background color and box shadow of the trigger button when the accordion item is expanded.

## Usage
For an easy-to-use accordion component in your project, the `VAccordionList` component provides a styled wrapper around the base accordion components. It is designed to manage a list of items with titles and descriptions.

The `VAccordionList` component is located in the `ui-kit/src/components/VAccordion/VAccordionList.vue` file, and here's an example of how it's structured:

```vue
<script setup lang="ts">
import {
  VAccordionItem, VAccordion, VAccordionContent, VAccordionTrigger,
} from 'UiKit/components/Base/VAccordion';
import { PropType } from 'vue';

interface IVAccordionListDefault {
  title: string;
  description: string;
}

defineProps({
  data: Array as PropType<IVAccordionListDefault[]>,
});
</script>

<template>
  <VAccordion
    type="single"
    collapsible
    class="VAccordionListDefault v-accordion-list-default"
  >
    <VAccordionItem
      v-for="(item, idx) in data"
      :key="idx"
      :value="idx"
      transparent
    >
      <VAccordionTrigger
        class="v-accordion-list-default__title is--h4__title"
      >
        {{ item.title }}
      </VAccordionTrigger>
      <VAccordionContent
        class="v-accordion-list-default__content is--body"
      >
        <p v-html="item.description" />
      </VAccordionContent>
    </VAccordionItem>
  </VAccordion>
</template>

<style lang="scss">
.v-accordion-list-default {
  &__content {
    color: $black;
  }
}
</style>
```

### Key Features
- **`Single Accordion Mode`**: The type="single" prop ensures that only one accordion item can be expanded at a time.
- **`Collapsible Option`**: The `collapsible` prop allows users to collapse all items, making the accordion behavior more flexible.
- **`Custom Styling`**: The `VAccordionList` component supports custom styling for the titles and content. For instance, the description content is styled with a specific gray color for readability.

The VAccordionList makes it easy to display a list of accordion items with dynamically generated content, ensuring both flexibility and ease of use.

### Example
<script setup lang="ts">
import VAccordionList from 'UiKit/components/VAccordion/VAccordionList.vue';
const data = [
  {
    title: 'Title 1',
    description: 'Description 1',
  },
  {
    title: 'Title 2',
    description: 'Description 2',
  },
  {
    title: 'Title 3',
    description: 'Description 3',
  },
]
</script>

<div class="is--margin-top-40">
  <VAccordionList
    :data="data"
  />
</div>