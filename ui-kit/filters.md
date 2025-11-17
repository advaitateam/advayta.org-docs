---
layout: uikit-single
title: Filters
slug: filters
draft: false
publishDate: 2025-10-13
tags:
  - ui-kit
---

`VDialogFilters` is a modal dialog that provides a simple way to add author and country filters to any listing page. It supports two-way binding for selected values and a clear-all action. The author and country sections are rendered only if both: options are available and the corresponding i18n label exists.

## Location
```src/components/VDialogFilters.vue```

## When to use
- **Listings**: Event lists, audio lists, posts — wherever you need quick, multi-select filters.
- **Compact UIs**: The trigger renders as an icon button and opens a modal with checkboxes.

## Quick start
1) Import the component on the page where you need filters.
2) Provide unique options for authors and countries.
3) Bind `open`, `selectedAuthors`, and `selectedCountries` via v-model.

### Example
```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import VDialogFilters from '@/components/VDialogFilters.vue';

// Example data source
const items = ref([
  { title: 'Item 1', author: 'Author A', country: 'UA' },
  { title: 'Item 2', author: 'Author B', country: 'DE' },
]);

// Dialog state and selected filters
const openFilters = ref(false);
const selectedAuthors = ref<string[]>([]);
const selectedCountries = ref<string[]>([]);

// Unique options for filters (accepts array of strings or objects with { label })
const uniqueAuthors = computed(() => Array.from(new Set(items.value.map(i => i.author))));
const uniqueCountries = computed(() => Array.from(new Set(items.value.map(i => i.country))));

function clearAllFilters() {
  selectedAuthors.value = [];
  selectedCountries.value = [];
}

const filteredItems = computed(() => {
  return items.value.filter(i => {
    const byAuthor = selectedAuthors.value.length === 0 || selectedAuthors.value.includes(i.author);
    const byCountry = selectedCountries.value.length === 0 || selectedCountries.value.includes(i.country);
    return byAuthor && byCountry;
  });
});
</script>

<template>
  <div>
    <div class="toolbar">
      <VDialogFilters
        v-model:open="openFilters"
        v-model:selectedAuthors="selectedAuthors"
        v-model:selectedCountries="selectedCountries"
        :unique-authors="uniqueAuthors"
        :unique-countries="uniqueCountries"
        @clearAll="clearAllFilters"
      />
    </div>

    <ul>
      <li v-for="(item, idx) in filteredItems" :key="idx">{{ item.title }}</li>
    </ul>
  </div>
  
</template>
```

## Props
- **uniqueAuthors**: `Array<string | { label: string; [key: string]: any }>`
  - List of author options. Strings or objects with a `label` key.
- **uniqueCountries**: `Array<string | { label: string; [key: string]: any }>`
  - List of country options. Strings or objects with a `label` key.
  
Notes:
- If `uniqueAuthors` resolves to an empty list or the locale key `filters.byAuthor` is missing, the author section is hidden.
- If `uniqueCountries` resolves to an empty list or the locale key `filters.byCountry` is missing, the country section is hidden.

## v-model bindings
- **v-model:open**: `boolean` — Controls dialog visibility.
- **v-model:selectedAuthors**: `string[]` — Selected author values.
- **v-model:selectedCountries**: `string[]` — Selected country values.

## Events
- **clearAll** — Emitted after clearing authors and countries inside the dialog.

## i18n
`VDialogFilters` uses the locale via `useLocale()` for the following keys, with fallbacks:
- `filters.title` → defaults to "Filters"
- `filters.byAuthor` → section is shown only if this key exists; label falls back to "By author" inside the group
- `filters.byCountry` → section is shown only if this key exists; label falls back to "By country" inside the group
- `filters.clearAll` → defaults to "Clear all"
- `filters.save` → defaults to "Save"

## Real usage in project
See `src/layouts/Event/List.vue` for an in-context usage:
```417:424:src/layouts/Event/List.vue
<VDialogFilters
  v-model:open="openFilters"
  v-model:selectedAuthors="selectedAuthors"
  v-model:selectedCountries="selectedCountries"
  :unique-authors="uniqueAuthors"
  :unique-countries="uniqueCountries"
  @clearAll="clearAllFilters"
/>
```

## Tips
- Keep filtering logic in the page component (computed over your dataset).
- Use URL/query sync for filters if needed by pairing with your routing strategy.
- Provide debounced or paginated data sources for large option lists.


