---
layout: uikit-single
title: Social Links
slug: social-links
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---

## Overview
The `VSocialLinks` component is designed to display a list of social media links with corresponding icons. It allows for easy integration of social media profiles into your application. Location - `ui-kit/src/components/VSocialLinks/VSocialLinks.vue`

## Features
- **Dynamic Social Links**: Render a list of social media links dynamically based on the provided data.
- **Custom Icons**: Use custom icons for each social media link.
- **Accessibility**: Each link is equipped with appropriate ARIA labels for better accessibility.

## Importing the Component
To use the `VSocialLinks` component, import it as follows:
```vue
import VSocialLinks from 'UiKit/components/VSocialLinks/VSocialLinks.vue';
```

## Component Props
The component accepts the following props:

| Prop Name   | Type                     | Default   | Required | Description                                           |
|-------------|--------------------------|-----------|----------|-------------------------------------------------------|
| `socialList`| `Array<ISocial>`         | `undefined` | Yes      | An array of social media objects containing icon, href, name, and iconName. |

## Default Slot
The `VSocialLinks` component does not support a default slot as it renders the social links directly from the provided `socialList` prop.

## Full Example
```vue
<script setup lang="ts">
import VSocialLinks from 'UiKit/components/VSocialLinks/VSocialLinks.vue';
import { useData } from 'vitepress';

const { theme } = useData();

const SOCIAL_LIST = [
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  theme.value?.socials?.facebook, theme.value?.socials?.instagram,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  theme.value?.socials?.linkedin, theme.value?.socials?.github,
];
</script>
<VSocialLinks :social-list="SOCIAL_LIST"/>
```

<script setup lang="ts">
import VSocialLinks from 'UiKit/components/VSocialLinks/VSocialLinks.vue';
import { useData } from 'vitepress';

const { theme } = useData();

const SOCIAL_LIST = [
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  theme.value?.socials?.facebook, theme.value?.socials?.instagram,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  theme.value?.socials?.linkedin, theme.value?.socials?.github,
];
</script>
<VSocialLinks :social-list="SOCIAL_LIST"/>




<VSocialLinks
  :social-list="SOCIAL_LIST"
  variant="link"
  class="is--margin-top-40"
/>

<VSocialLinks
  :social-list="SOCIAL_LIST"
  color="secondary"
  class="is--margin-top-40"
/>