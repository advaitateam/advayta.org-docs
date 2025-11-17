---
layout: uikit-single
title: Select
slug: select
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---

<script setup lang="ts">
import VSelect from 'UiKit/components/VSelect.vue';
import { computed } from 'vue';
import { useLocale } from '@/core/composables/useLocale';

const { currentLocale } = useLocale();

enum SortOptionValue {
  PublicationDateAsc = 'publicationDateAsc',
  PublicationDateDesc = 'publicationDateDesc',
  EventDateAsc = 'eventDateAsc',
  EventDateDesc = 'eventDateDesc',
}

const SortOptionConfig: Record<SortOptionValue, { key: string; order: 'ascending' | 'descending' }> = {
  [SortOptionValue.PublicationDateAsc]: { key: 'publishDate', order: 'ascending' },
  [SortOptionValue.PublicationDateDesc]: { key: 'publishDate', order: 'descending' },
  [SortOptionValue.EventDateAsc]: { key: 'startDate', order: 'ascending' },
  [SortOptionValue.EventDateDesc]: { key: 'startDate', order: 'descending' },
}

const sortOptions = computed(() => [
  {
    text: currentLocale.value?.home.sort.publicationDateAsc,
    value: SortOptionValue.PublicationDateAsc,
  },
  {
    text: currentLocale.value?.home.sort.publicationDateDesc,
    value: SortOptionValue.PublicationDateDesc,
  },
  {
    text: currentLocale.value?.home.sort.eventDateAsc,
    value: SortOptionValue.EventDateAsc,
  },
  {
    text: currentLocale.value?.home.sort.eventDateDesc,
    value: SortOptionValue.EventDateDesc,
  },
])
</script>

<VSelect
          v-model="sortSelect"
          placeholder="Choose"
          item-label="text"
          item-value="value"
          size="small"
          :options="sortOptions"
        />