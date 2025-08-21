---
layout: uikit-single
title: Article
slug: card-article
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---

## VCardArticle Component
The `VCardArticle` component is a versatile card designed for displaying article information, including a publish date, title, description, and an optional cover image. It supports customizable styles and layouts.
Location: `ui-kit/src/components/VCard/VCardArticle.vue`

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
import VCardArticle from 'UiKit/components/VCard/VCardArticle';
</script>

<template>
  <VCardArticle
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
import VCardArticle from 'UiKit/components/VCard/VCardArticle.vue';
import VSectionCardArticleList from 'UiKit/components/VCard/VSectionCardArticleList.vue';

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

<VCardArticle
    :data="{
      title: 'How to Improve Performance in Vue',
      description: 'A comprehensive guide to optimizing performance in your Vue.js applications.',
      publishDate: '2025-01-10T00:00:00Z',
      url: '#',
      cover: { image: '/images/blog/players.jpeg' },
    }"
/>

## VSectionCardArticleList Component
The `VSectionCardArticleList` component is a structured section that displays a list of articles in a styled layout. It integrates with the `VCardArticle` component for individual article cards. Location: `ui-kit/src/components/VCard/VSectionCardArticleList.vue`

## Props
| Prop Name    | Type                   | Required | Default | Description                                                                 |
|--------------|------------------------|----------|---------|-----------------------------------------------------------------------------|
| `title`      | `String`               | No       | —       | The main title of the section.                                             |
| `subTitle`   | `String`               | No       | —       | The subtitle of the section.                                               |
| `items`      | `IFrontmatter[]`       | Yes      | —       | An array of article metadata objects. Each object is passed to `VCardArticle`. |
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
import VSectionCardArticleList from 'UiKit/components/VCard/VSectionCardArticleList.vue';
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
  <VSectionCardArticleList
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
  </VSectionCardArticleList>
</template>
```

#### No data:
<div style="margin: 40px -15px;">
<VSectionCardArticleList
    title="Latest Articles"
    subTitle="Stay informed with our updates"
    :items="[]"
    buttonHref="/articles"
    buttonText="View All"
>

  <template #noData>
      <p>No articles available at the moment. Please check back later.</p>
  </template>
</VSectionCardArticleList>
</div>

#### Section with list:
<div style="margin: 40px -15px;">
<VSectionCardArticleList
    title="Latest Articles"
    subTitle="Stay informed with our updates"
    :items="articles"
    buttonHref="/articles"
    buttonText="View All"
>

  <template #noData>
      <p>No articles available at the moment. Please check back later.</p>
  </template>
</VSectionCardArticleList>
</div>
