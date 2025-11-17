---
layout: uikit-single
title: Infinite Scroll
slug: infinite-scroll
draft: false
publishDate: 2025-08-05
is_main: true
tags:
  - ui-kit
---

This document explains how to use the general infinite scroll solution implemented in the codebase.

## Overview
The infinite scroll functionality has been implemented as a reusable solution as composable:

1. **`useInfiniteScroll` composable** - Core logic for infinite scroll (located in `@/core/composables/useInfiniteScroll`)

## Using the Composable (Recommended)
The `useInfiniteScroll` composable provides the most flexible approach:

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useInfiniteScroll } from '@/core/composables/useInfiniteScroll';

// Your data source
const allItems = computed(() => yourData.value || []);

// Use the composable
const {
  paginatedItems,
  hasMoreItems,
  isLoadingMore,
  isInfiniteLoading,
  triggerElement,
  resetPagination,
} = useInfiniteScroll(allItems, {
  itemsPerPage: 10,    // Items per page (default: 10)
  distance: 10,        // Distance from bottom to trigger (default: 10)
  resetOnChange: true, // Reset pagination when items change (default: true)
});
</script>

<template>
  <!-- Your list component -->
  <VCardArticleList :items="paginatedItems" />
  
  <!-- Loading indicator -->
  <div v-if="isLoadingMore || isInfiniteLoading" class="loading-more">
    <p>Loading more items...</p>
  </div>
  
  <!-- Trigger element -->
  <div 
    v-if="hasMoreItems" 
    ref="triggerElement"
    class="trigger-element"
    style="height: 1px; margin: 20px 0;"
  ></div>
</template>
