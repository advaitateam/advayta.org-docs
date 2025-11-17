---
layout: uikit-single
title: Search Component
slug: search
is_main: false
draft: false
publishDate: 2024-12-19
---

The search functionality in this application is powered by Algolia DocSearch and provides a powerful, fast search experience across the entire site. This guide explains how to add search functionality to any page.

## Overview

The search system consists of:
- **VPNavBarSearch**: Main search component that handles user interaction
- **VPAlgoliaSearchBox**: Core search implementation using Algolia DocSearch
- **Search Configuration**: Algolia settings and search parameters

## Basic Implementation

### 1. Import the Search Component

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const VPNavBarSearch = defineAsyncComponent(() => import('@/components/VPNavBarSearch.vue'));
</script>
```

### 2. Add Search to Your Template

```vue
<template>
  <div class="your-page">
    <!-- Your page content -->
    
    <ClientOnly>
      <VPNavBarSearch
        container-id="docsearch-your-page"
        :filter-by-url-includes="['/your-section']"
      />
    </ClientOnly>
    
    <!-- Rest of your content -->
  </div>
</template>
```

## Component Props

### VPNavBarSearch Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `container-id` | `string` | `'docsearch'` | Unique ID for the search container |
| `filter-by-url-includes` | `string[]` | `[]` | Array of URL patterns to filter search results |
| `variant` | `'default' \| 'link'` | `'default'` | Visual variant of the search component |

## Advanced Usage

### Filtering Search Results

To limit search results to specific sections of your site, use the `filter-by-url-includes` prop:

```vue
<VPNavBarSearch
  container-id="docsearch-audio"
  :filter-by-url-includes="['/audiogalereya/audiolektsii', '/аудиогалерея/аудиолекции']"
/>
```

### Multiple Search Instances

You can have multiple search components on the same page with different filters:

```vue
<template>
  <div class="page-with-multiple-search">
    <!-- General search -->
    <VPNavBarSearch
      container-id="docsearch-general"
    />
    
    <!-- Audio-specific search -->
    <VPNavBarSearch
      container-id="docsearch-audio"
      :filter-by-url-includes="['/audio']"
    />
    
    <!-- Video-specific search -->
    <VPNavBarSearch
      container-id="docsearch-video"
      :filter-by-url-includes="['/video']"
    />
  </div>
</template>
```

## Real-world Examples

### Example 1: Page List with Search

```vue
<template>
  <div class="VideoList view-video-list is--page">
    <div class="is--container is--no-padding">
      <VBreadcrumbsList
        v-if="breadcrumbsList"
        :slug="frontmatter.slug"
        :data="breadcrumbsList"
        class="view-video-list__breadcrumbs"
      />
    </div>
    
    <div class="VideoListContent is--container is--no-padding is--margin-top-40">
      <section class="page-content">
        <h1 v-if="frontmatter.title || page.title">
          {{ frontmatter.title || page.title }}
        </h1>
        
        <!-- Search component -->
        <ClientOnly v-if="frontmatter.search">
          <VPNavBarSearch
            :container-id="`docsearch-${frontmatter.title}`"
            :filter-by-url-includes="[frontmatter.url]"
          />
        </ClientOnly>
        
        <div class="v-page-content__wrap user__content">
          <Content />
        </div>
        
        <!-- Your content list -->
        <VCardCourseList
          :items="childrens"
          :loading="isDataLoading"
          class="is--margin-top-40"
        />
      </section>
    </div>
  </div>
</template>
```

### Example 2: Audio List with Filtered Search

```vue
<template>
  <div class="AudioList view-audio-list is--page">
    <div class="AudioListContent is--container is--no-padding is--margin-top-40">
      <section class="page-content">
        <h1>{{ frontmatter.title || page.title }}</h1>
        
        <div class="view-audio-list__filters">
          <!-- Search with URL filtering -->
          <ClientOnly>
            <VPNavBarSearch
              container-id="docsearch-audios"
              :filter-by-url-includes="['/audiogalereya/audiolektsii', '/аудиогалерея/аудиолекции']"
            />
          </ClientOnly>
          
          <!-- Other filters -->
          <div class="view-audio-list__sort">
            <VDateRangePicker v-model="dateRange" />
            <VButton @click="clearAllFilters">Clear</VButton>
          </div>
        </div>
        
        <!-- Audio content -->
        <VCardEventList
          :items="paginatedItems"
          :loading="isDataLoading"
          no-container
        />
      </section>
    </div>
  </div>
</template>
```

## Keyboard Shortcuts

The search component supports the following keyboard shortcuts:

- **Ctrl/Cmd + K**: Open search modal
- **/** (forward slash)**: Open search modal (when not in input fields)

## Styling

The search component uses the following CSS classes that you can customize:

```scss
.VPNavBarSearch {
  display: flex;
  align-items: center;
  justify-content: center;
  
  // Desktop styles
  @media (min-width: 960px) {
    flex-grow: 1;
  }
}

// Dark mode support
.dark .DocSearch-Footer {
  border-top: 1px solid var(--vp-c-divider);
}

.DocSearch-Form {
  border: 1px solid var(--vp-c-brand-1);
  background-color: var(--vp-c-white);
}

.dark .DocSearch-Form {
  background-color: var(--vp-c-default-soft);
}
```

## Configuration

The search is configured in `.vitepress/configs/theme.ts` with Algolia settings:

```typescript
export default {
  search: {
    provider: 'algolia',
    options: {
      indexName: 'advayta.org',
      // ... additional configuration
    }
  }
}
```
