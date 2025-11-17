---
layout: uikit-single
title: Course
slug: card-course
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---

## VCardCourse Component
The `VCardCourse` component is a versatile card designed for displaying article information, including a publish date, title, description, and an optional cover image. It supports customizable styles and layouts.
Location: `ui-kit/src/components/VCard/VCardCourseListElement.vue`

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
import VCardCourse from 'UiKit/components/VCard/VCardCourseListElement.vue';
</script>

<template>
  <VCardCourse
    :data="{
      title: 'How to Improve Performance in Vue',
      description: 'A comprehensive guide to optimizing performance in your Vue.js applications.',
      publishDate: '2025-01-10T00:00:00Z',
      url: '/articles/vue-performance',
      author: ['Some author'],
      tags: ['tag1', 'tag1'],
      cover: { image: '/images/blog/players.jpeg' },
    }"
  />
</template>
```

<script setup lang="ts">
import VCardCourse from 'UiKit/components/VCard/VCardCourseListElement.vue';
import VSectionCardCourseList from 'UiKit/components/VCard/VSectionCardCourseList.vue';

const articles = [
  {
    title: 'Article One',
    description: 'This is the description for article one.',
    publishDate: '2024-01-10',
    url: '#',
    slug: 'article-one',
    author: ['Some author'],
    tags: ['tag1', 'tag1'],
    cover: { image: '/images/blog/players.jpeg' },
  },
  {
    title: 'Article Two',
    description: 'This is the description for article two.',
    publishDate: '2024-01-12',
    url: '#',
    slug: 'article-two',
    author: ['Some author'],
    tags: ['tag1', 'tag1'],
    cover: { image: '/images/blog/players.jpeg' },
  },
  // More articles can be added here
];
</script>

<VCardCourse
    :data="{
      title: 'How to Improve Performance in Vue',
      description: 'A comprehensive guide to optimizing performance in your Vue.js applications.',
      publishDate: '2025-01-10T00:00:00Z',
      url: '#',
      author: ['Some author'],
      tags: ['tag1', 'tag1'],
      cover: { image: '/images/blog/players.jpeg' },
    }"
/>

## VSectionCardCourseList Component
The `VSectionCardCourseList` component is a structured section that displays a list of articles in a styled layout. It integrates with the `VCardCourse` component for individual article cards. Location: `ui-kit/src/components/VCard/VSectionCardCourseList.vue`

## Props
| Prop Name    | Type                   | Required | Default | Description                                                                 |
|--------------|------------------------|----------|---------|-----------------------------------------------------------------------------|
| `title`      | `String`               | No       | —       | The main title of the section.                                             |
| `subTitle`   | `String`               | No       | —       | The subtitle of the section.                                               |
| `items`      | `IFrontmatter[]`       | Yes      | —       | An array of article metadata objects. Each object is passed to `VCardCourse`. |
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
import VSectionCardCourseList from 'UiKit/components/VCard/VSectionCardCourseList.vue';
const articles = [
  {
    title: 'Article One',
    description: 'This is the description for article one.',
    publishDate: '2024-01-10',
    url: '#',
    slug: 'article-one',
    author: ['Some author'],
    tags: ['tag1', 'tag1'],
    cover: { image: '/images/blog/players.jpeg' },
  },
  {
    title: 'Article Two',
    description: 'This is the description for article two.',
    publishDate: '2024-01-12',
    url: '#',
    slug: 'article-two',
    author: ['Some author'],
    tags: ['tag1', 'tag1'],
    cover: { image: '/images/blog/players.jpeg' },
  },
  // More articles can be added here
];
</script>
<template>
  <VSectionCardCourseList
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
  </VSectionCardCourseList>
</template>
```

#### No data:
<div style="margin: 40px -15px;">
<VSectionCardCourseList
    title="Latest Articles"
    subTitle="Stay informed with our updates"
    :items="[]"
    buttonHref="/articles"
    buttonText="View All"
>

  <template #noData>
      <p>No articles available at the moment. Please check back later.</p>
  </template>
</VSectionCardCourseList>
</div>

#### Section with list:
<div style="margin: 40px -15px;">
<VSectionCardCourseList
    title="Latest Articles"
    subTitle="Stay informed with our updates"
    :items="articles"
    buttonHref="/articles"
    buttonText="View All"
>

  <template #noData>
      <p>No articles available at the moment. Please check back later.</p>
  </template>
</VSectionCardCourseList>
</div>
