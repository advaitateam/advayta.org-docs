---
layout: uikit-single
title: Related Pages
slug: related-pages
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---

The `VRelatedPages` component is a Vue 3 component that displays a table of related pages, grouped by a specified category.

## Props
| Prop Name   | Type                      | Required | Description |
|-------------|---------------------------|----------|-------------|
| `data`      | `IRelatedPages[]`        | Yes      | An array of related pages, each containing a group and its items. |

``` ts
interface IRelatedPages {
    groupBy: IFrontmatter;
    items: IFrontmatter[];
}
```

## Example
```vue
<script setup lang="ts">
  import VRelatedPages from 'UiKit/components/VRelatedwiki/VRelatedPages.vue';
  const relatedPages = [
    {
      groupBy: { title: 'Group 1', url: '/group-1' },
      items: [
        { title: 'Related Page 1', url: '/related-page-1' },
        { title: 'Related Page 2', url: '/related-page-2' },
      ],
    },
    {
      groupBy: { title: 'Group 2', url: '/group-2' },
      items: [
        { title: 'Related Page 3', url: '/related-page-3' },
        { title: 'Related Page 4', url: '/related-page-4' },
      ],
    },
  ];
</script>
<VRelatedPages :data="relatedPages" />
```

<script setup lang="ts">
  import VRelatedPages from 'UiKit/components/VRelatedPages/VRelatedPages.vue';
  import VSectionRelatedPages from 'UiKit/components/VRelatedPages/VSectionRelatedPages.vue';
import { onMounted, computed } from 'vue';
import { pages } from 'UiKit/types/pages';


const currentPage = computed(() => (
  pages.getPageByURL("/master/intervyu/ayurveda-nauka-zhizni")
));

const relatedPages = computed(() => {
  let data = [];
  if (currentPage.value) {
    // if we have a children - add them
    if (Object.keys(currentPage.value.children).length > 0) {
      data.push(currentPage.value);
    }
    const parent = currentPage.value.getParent(true);
    // one from top
    if (parent && parent.data.url != '/') {
      data = data.concat(parent);
    }
    // all prev and next categories
    let next = currentPage.value.next();
    let idx = 0;
    while (next !== null && idx < 15) {
      if (next.childsLength() !== 0) {
        data.push(next);
      }
      next = next.next();
      idx ++;
    }
    idx = 0;
    let prev = currentPage.value.prev();
    while (prev !== null && idx < 15) {
      if (prev.childsLength() !== 0) {
        data.push(prev);
      }
      prev = prev.prev();
      idx ++;
    }
  }
  return data;
});
</script>
<VRelatedPages :data="relatedPages" />


## VSectionRelatedPages
The `VSectionRelatedPages` component wraps the `VRelatedPages` component within a `VSection`, allowing for a title slot and providing a structured layout for displaying related pages.

## Props
| Prop Name   | Type                      | Required | Description |
|-------------|---------------------------|----------|-------------|
| `data`      | `IRelatedPages[]`        | Yes      | An array of related pages, each containing a group and its items. |


## Slots
- `default`: Slot for additional content displayed above the related pages.


## Example
```vue
<script setup lang="ts">
  import VSectionRelatedPages from 'UiKit/components/VRelatedPages/VSectionRelatedPages.vue';
</script>
<VSectionRelatedPages :data="relatedPages">
    <h2>Related Pages</h2>
</VSectionRelatedPages>
```

<VSectionRelatedPages :data="relatedPages">
    <h2>Related Pages</h2>
</VSectionRelatedPages>