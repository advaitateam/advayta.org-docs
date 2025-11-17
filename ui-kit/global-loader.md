---
layout: uikit-single
title: Global Loader
slug: global-loader
draft: false
publishDate: 2025-08-05
is_main: true
tags:
  - ui-kit
---

The Global Loader is a centralized loading state management system that provides a consistent loading experience across the application. It uses Pinia for state management and displays a full-screen loader with the application's logo.

## Overview
The Global Loader consists of two main parts:
1. **State Management Store** (`useGlobalLoader`) - Manages the loading state
2. **UI Component** (`VLoader`) - Renders the loading overlay

## API Reference
## useGlobalLoader Store
The global loader store provides the following methods and properties:

```typescript
import { useGlobalLoader } from '@/core/store/useGlobalLoader';

const globalLoader = useGlobalLoader();
```

### Properties
- `isLoading: Ref<boolean>` - Reactive boolean indicating if the loader is currently visible

### Methods
- `show()` - Shows the global loader
- `hide()` - Hides the global loader  
- `toggle(value?: boolean)` - Toggles the loader state (optional boolean parameter)


## Usage Patterns
## 1. Basic Usage
```vue
<script setup>
import { useGlobalLoader } from '@/core/store/useGlobalLoader';

const globalLoader = useGlobalLoader();

// Show loader
globalLoader.show();

// Hide loader
globalLoader.hide();

// Toggle loader
globalLoader.toggle();
</script>
```

## 2. Reactive Loading State
```vue
<script setup>
import { useGlobalLoader } from '@/core/store/useGlobalLoader';
import { storeToRefs } from 'pinia';

const globalLoader = useGlobalLoader();
const { isLoading } = storeToRefs(globalLoader);

// Use isLoading in computed properties or watchers
const showLoader = computed(() => isLoading.value || someOtherCondition.value);
</script>

<template>
  <VLoader v-if="showLoader" />
</template>
```

## 3. Route Change Loading
Show loader before route changed. Hide after rendered

```vue
<script setup>
import { useGlobalLoader } from '@/core/store/useGlobalLoader';
import { useRoute } from 'vitepress';

const route = useRoute();

watch(
  () => route.path,
  () => {
    setTimeout(() => {
      useGlobalLoader().hide();
    }, 100);
  },
  { immediate: true }
);
</script>
```

## 4. Link Click Loading
Show loader when internal links are clicked:

```vue
<script setup>
import { useGlobalLoader } from '@/core/store/useGlobalLoader';

function handleLinkClick(event) {
  const target = event.target;
  const link = target.closest('a');
  
  if (link) {
    const href = link.getAttribute('href') || '';
    const isInternalLink = href.startsWith('/') && !href.startsWith('//');
    const isCurrentPage = href === window.location.pathname;
    
    if (isInternalLink && !isCurrentPage) {
      useGlobalLoader().show();
    }
  }
}
</script>
```

## Implementation Examples
## AppLayoutDefault.vue
The main layout component demonstrates comprehensive global loader usage:

```vue
<script setup>
import { useGlobalLoader } from '@/core/store/useGlobalLoader';
import { storeToRefs } from 'pinia';

const isFontLoaded = ref(false);
const globalLoader = useGlobalLoader();
const { isLoading: globalLoaderisLoading } = storeToRefs(globalLoader);

// Combine with font loading state
const showLoader = computed(() => globalLoaderisLoading.value || !isFontLoaded.value);

// Initialize loader on mount
globalLoader.toggle(true);

// Font loading check
const checkIfFontLoaded = async () => {
  if (document?.fonts) {
    await document.fonts.ready.then(() => {
      setTimeout(() => {
        isFontLoaded.value = true;
      }, 1000);
    });
  } else {
    setTimeout(() => {
      isFontLoaded.value = true;
    }, 1000);
  }
};

// Show loader on internal link clicks
function handleLinkClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const link = target.closest('a') as HTMLAnchorElement | null;

  if (link) {
    const href = link.getAttribute('href') || '';
    
    // Check if it's an internal link (starts with / but not //)
    const isInternalLink = href.startsWith('/') && !href.startsWith('//');
    
    // Check if it's not pointing to the current page
    const isCurrentPage = href === window.location.pathname || 
                         href === window.location.href || 
                         href === '#';
    
    // Show loader only for internal links that aren't the current page
    if (isInternalLink && !isCurrentPage) {
      globalLoader.show();
    }
  }
}

onMounted(() => {
  void checkIfFontLoaded();
  document.addEventListener('click', handleLinkClick);
  
  // Router navigation handlers
  router.onBeforeRouteChange = () => {
    globalLoader.show();
  };
  router.onAfterRouteChange = () => {
    setTimeout(() => {
      globalLoader.toggle(false);
    }, 100);
  };
});

onUnmounted(() => {
  document.removeEventListener('click', handleLinkClick);
  router.onBeforeRouteChange = undefined;
  router.onAfterRouteChange = undefined;
});
</script>

<template>
  <div class="AppLayoutDefault app-layout-default">
    <transition name="transition-fade-out">
      <VLoader v-if="showLoader" />
    </transition>
    <!-- rest of layout -->
  </div>
</template>
```

## ViewHome.vue
Hides loader after route changes:

```vue
<script setup>
import { useGlobalLoader } from '@/core/store/useGlobalLoader';

watch(
  () => route.path,
  () => {
    setTimeout(() => {
      useGlobalLoader().hide();
    }, 100);
  },
  { immediate: true }
);
</script>
```
