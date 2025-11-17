---
layout: uikit-single
title: Popular Tags
slug: popular-tags
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---

## Popular Tags Feature

The website includes functionality to display the 25 most popular tags across all content. This feature uses the `useTags` composable to analyze tag usage and display them using the `VBadgeClickToBlogInline` component.

### Implementation

To add the 25 most popular tags to any page, follow these steps:

1. **Import the required composable and component:**
```vue
<script setup lang="ts">
import { useTags } from '@/core/composables/useTags';
import VBadgeClickToBlogInline from 'UiKit/components/VBadge/VBadgeClickToBlogInline.vue';
</script>
```

2. **Set up the composable with your data source:**
```vue
<script setup lang="ts">
// Assuming you have a pages array (e.g., from navigation, videos, etc.)
const { mostPopularTags } = useTags({
  pages: yourPagesArray, // Array of pages with tags
  limit: 25 // Get top 25 most popular tags
});

// Convert TagCount objects to string array for the component
const popularTags = computed(() => {
  return mostPopularTags.value.map(tagCount => tagCount.tag);
});
</script>
```

3. **Use the component in your template:**
```vue
<template>
  <VBadgeClickToBlogInline
    :data="popularTags"
    color="secondary"
    url="/tag"
  />
</template>
```

### useTags Composable

The `useTags` composable provides functionality to analyze and extract the most popular tags from a collection of pages.

#### Location
```src/core/composables/useTags.ts```

#### Props
- `pages`: Array of pages or reactive reference to pages array
- `limit`: Optional number to limit the number of popular tags returned (default: 10)

#### Returns
- `mostPopularTags`: Computed property that returns an array of `TagCount` objects
- `getMostPopularTags`: Function to manually get popular tags from a pages array

#### TagCount Interface
```typescript
interface TagCount {
  tag: string
  count: number
}
```

### VBadgeClickToBlogInline Component

This component displays multiple clickable tags in an inline layout, perfect for showing popular tags.

#### Location
```src/core/components/VBadge/VBadgeClickToBlogInline.vue```

#### Props
- `data` (required): Array of strings representing tag names
- `color`: Optional color variant for the badges
- `url`: Base URL for tag links (default: '/tag')

#### Features
- Displays tags as clickable badges
- Automatically handles duplicate removal
- Responsive inline layout
- Each badge links to the tag page with filtering

### Example Usage in VideoList.vue

Here's a real-world example from the VideoList component:

```vue
<script setup lang="ts">
import { useTags } from '@/core/composables/useTags';
import VBadgeClickToBlogInline from 'UiKit/components/VBadge/VBadgeClickToBlogInline.vue';

// Get videos data
const videosAll = computed(() => {
  return navigation.value.videosData || [];
});

// Get 25 most popular tags from videos
const { mostPopularTags } = useTags({
  pages: videosAll,
  limit: 25
});

// Convert TagCount objects to string array
const popularTags = computed(() => {
  return mostPopularTags.value.map(tagCount => tagCount.tag);
});
</script>

<template>
  <VBadgeClickToBlogInline
    :data="popularTags"
    color="secondary"
    url="/tag"
  />
</template>
```

This implementation will automatically display the 25 most frequently used tags across all your content, providing users with quick access to popular topics.
