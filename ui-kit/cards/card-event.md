---
layout: uikit-single
title: Event
slug: card-event
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---

## VCardEvent Component
The `VCardEvent` component is a versatile card designed for displaying article information, including a publish date, title, description, and an optional cover image. It supports customizable styles and layouts.
Location: `ui-kit/src/components/VCard/VCardEventListElement.vue`

## Props
| Prop Name   | Type               | Required | Default | Description                                                             |
|-------------|--------------------|----------|---------|-------------------------------------------------------------------------|
| `data`      | `IFrontmatter`     | Yes      | —       | The article's metadata, including title, description, publish date, and cover image. |
| `small`     | `Boolean`          | No       | `false` | Enables a compact layout for the card.                                 |

## Slots
| Slot Name | Description                                      |
|-----------|--------------------------------------------------|
| Default   | Content inside the card's main body.            |

## Example
```vue
<script setup lang="ts">
import VCardEvent from 'UiKit/components/VCard/VCardEvent';
</script>

<template>
  <VCardEvent
    :data="{
      title: 'How to Improve Performance in Vue',
      description: 'A comprehensive guide to optimizing performance in your Vue.js applications.',
      publishDate: '2025-01-10T00:00:00Z',
      url: '/articles/vue-performance',
      cover: { image: '/images/blog/players.jpeg' },
    }"
  />
</template>
```

<script setup lang="ts">
import VCardEvent from 'UiKit/components/VCard/VCardEventListElement.vue';
import VSectionCardEventList from 'UiKit/components/VCard/VSectionCardEventList.vue';

const articles = [
  {
    title: 'Article One',
    description: 'This is the description for article one.',
    publishDate: '2024-01-10',
    url: '#',
    slug: 'article-one',
    cover: { image: '/images/blog/players.jpeg' },
  },
  {
    title: 'Article Two',
    description: 'This is the description for article two.',
    publishDate: '2024-01-12',
    url: '#',
    slug: 'article-two',
    cover: { image: '/images/blog/players.jpeg' },
  },
  // More articles can be added here
];
</script>

<VCardEvent
    :data="{
      title: 'How to Improve Performance in Vue',
      description: 'A comprehensive guide to optimizing performance in your Vue.js applications.',
      publishDate: '2025-01-10T00:00:00Z',
      url: '#',
      cover: { image: '/images/blog/players.jpeg' },
    }"
/>

## VSectionCardEventList Component
The `VSectionCardEventList` component is a structured section that displays a list of articles in a styled layout. It integrates with the `VCardEvent` component for individual article cards. Location: `ui-kit/src/components/VCard/VSectionCardEventList.vue`

## Props
| Prop Name    | Type                   | Required | Default | Description                                                                 |
|--------------|------------------------|----------|---------|-----------------------------------------------------------------------------|
| `title`      | `String`               | No       | —       | The main title of the section.                                             |
| `subTitle`   | `String`               | No       | —       | The subtitle of the section.                                               |
| `items`      | `IFrontmatter[]`       | Yes      | —       | An array of article metadata objects. Each object is passed to `VCardEvent`. |
| `buttonHref` | `String`               | No       | —       | URL for an optional button in the section header.                          |
| `buttonText` | `String`               | No       | —       | Text for the optional button in the section header.                        |
| `noContainer`| `Boolean`              | No       | `false` | Determines if the section has a container wrapper.                         |


## Slots
| Slot Name    | Description                                     |
|--------------|-------------------------------------------------|
| `infoShort`  | Content displayed in the section header's short info area. |
| `noData`     | Custom content to display when the `items` array is empty. |


## Example
```vue
<script setup lang="ts">
import VSectionCardEventList from 'UiKit/components/VCard/VSectionCardEventList.vue';
const articles = [
  {
    title: 'Article One',
    description: 'This is the description for article one.',
    publishDate: '2024-01-10',
    url: '#',
    slug: 'article-one',
    cover: { image: '/images/blog/players.jpeg' },
  },
  {
    title: 'Article Two',
    description: 'This is the description for article two.',
    publishDate: '2024-01-12',
    url: '#',
    slug: 'article-two',
    cover: { image: '/images/blog/players.jpeg' },
  },
  // More articles can be added here
];
</script>
<template>
  <VSectionCardEventList
    title="Latest Articles"
    subTitle="Stay informed with our updates"
    :items="articles"
    buttonHref="/articles"
    buttonText="View All"
  >
    <template #infoShort>
      <p>Read the most recent updates and articles from our team.</p>
    </template>

    <template #noData>
      <p>No articles available at the moment. Please check back later.</p>
    </template>
  </VSectionCardEventList>
</template>
```

#### No data:
<div style="margin: 40px -15px;">
<VSectionCardEventList
    title="Latest Articles"
    subTitle="Stay informed with our updates"
    :items="[]"
    buttonHref="/articles"
    buttonText="View All"
>

  <template #noData>
      <p>No articles available at the moment. Please check back later.</p>
  </template>
</VSectionCardEventList>
</div>

#### Section with list:
<div style="margin: 40px -15px;">
<VSectionCardEventList
    title="Latest Articles"
    subTitle="Stay informed with our updates"
    :items="articles"
    buttonHref="/articles"
    buttonText="View All"
>

  <template #noData>
      <p>No articles available at the moment. Please check back later.</p>
  </template>
</VSectionCardEventList>
</div>
