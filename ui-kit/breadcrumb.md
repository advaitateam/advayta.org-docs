---
layout: uikit-single
title: Breadcrumb
slug: breadcrumb
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---
## Overview
The `VBreadcrumb` component is a flexible and highly customizable element built using the ShadCN Vue library ([official documentation](https://www.shadcn-vue.com/docs/components/breadcrumb.html)). It displays the path to the current resource using a hierarchy of links.


This component is composed of several subcomponents, each with a specific role in managing different parts of the bredcrumb:

- **`VBreadcrumb`**: The root container that wraps the entire breadcrumb.
- **`VBreadcrumbList`**: A container for breadcrumb items.
- **`VBreadcrumbItem`**: Represents a single breadcrumb item.
- **`VBreadcrumbLink`**: A clickable link for navigation.
- **`VBreadcrumbEllipsis`**: Represents collapsed items using ellipsis.
- **`VBreadcrumbSeparator`**: Displays a visual separator between items.

These components are located in the path: `ui-kit/src/components/Base/VBreadcrumb`.

## Usage
Use `VBreadcrumbsList` (ui-kit/src/components/VBreadcrumb/VBreadcrumbsList.vue)
to dysplay basic default styles for bredcrumbs

#### Props:
- `data`(required): An array of bredcrumb, where each element has inreface
```
interface IBreadcrumb {
  text: string;
  href?: string;
}
```

#### Features:
- Displays a list of breadcumbs in a horizontal row.
- If href is not provided then it is simple text styles with no ability to click link

#### Example
<script setup lang="ts">
import VBreadcrumbsList from 'UiKit/components/VBreadcrumb/VBreadcrumbsList.vue';
import VBreadcrumbsListCollapsed from 'UiKit/components/VBreadcrumb/VBreadcrumbsListCollapsed.vue';
import VBreadcrumbsListDropdown from 'UiKit/components/VBreadcrumb/VBreadcrumbsListDropdown.vue';
import VBreadcrumbsListCollapsedDropdown from 'UiKit/components/VBreadcrumb/VBreadcrumbsListCollapsedDropdown.vue';
const breadcrumbsList = [
    {
        href: '/',
        text: 'Home',
    },
    {
        href: '/ui-kit',
        text: 'UiKit',
    },
    {
        text: 'Breadcrumb',
    },
];
const breadcrumbsList2 = [
  { href: '/', text: 'Home' },
  { href: '/ui-kit', text: 'UiKit' },
  { href: '/ui-kit', text: 'UiKit2' },
  { href: '/ui-kit', text: 'UiKit3' },
  { text: 'Breadcrumb' }
];

</script>
<VBreadcrumbsList
    :data="breadcrumbsList"
    class="is--margin-top-30"
>
        -
</VBreadcrumbsList>


Example with `->` as Separator:

```vue
<VBreadcrumbsList
    :data="breadcrumbsList"
>
    ->
</VBreadcrumbsList>
```

<VBreadcrumbsList
    :data="breadcrumbsList"
    class="is--margin-top-30"
>
    ->
</VBreadcrumbsList>

## Advanced Usages
### Collapsed Breadcrumbs
For scenarios where the breadcrumb trail becomes too long, you can use the `VBreadcrumbsListCollapsed` component in location `ui-kit/src/components/VBreadcrumb`. This will collapse intermediate items into an ellipsis (...) while keeping the first and last few breadcrumbs visible.

<VBreadcrumbsListCollapsed
    :data="breadcrumbsList2"
    class="is--margin-top-30"
/>

#### Dropdown
The `VBreadcrumbsListDropdown` component enables you to collapse intermediate breadcrumb items into a dropdown. This dropdown provides an intuitive way to access the hidden items when needed.
<VBreadcrumbsListDropdown
    :data="breadcrumbsList2"
    class="is--margin-top-30"
/>

#### Collapsed Dropdown
Combine the functionality of collapsed breadcrumbs with a dropdown using the `VBreadcrumbsListCollapsedDropdown` component. This setup is ideal for complex breadcrumb structures, offering an ellipsis with a dropdown menu for hidden items.
<VBreadcrumbsListCollapsedDropdown
    :data="breadcrumbsList2"
    class="is--margin-top-30"
/>