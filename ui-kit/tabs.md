---
layout: uikit-single
title: Tabs
slug: tabs
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---


<script setup lang="ts">
import { VTabs, VTabsList, VTabsTrigger } from 'UiKit/components/Base/VTabs';
import {
  computed, ref
} from 'vue';

const tabs = [{
    value: 'events',
    label: 'События',
    subTitle: '',
    data: [],
  }, {
    value: 'updates',
    label: 'Обновления',
    subTitle: '',
    data: [],
  }, {
    value: 'cources',
    label: 'Курсы',
    subTitle: '',
    data: [],
  }, {
    value: 'videos',
    label: 'Видео',
    subTitle: '',
    data: [],
  }, {
    value: 'favorite-article',
    label: 'Вики Дхарма',
    subTitle: '',
    data: [],
  }, 
];


const subtabsEvents = [{
    value: 'all',
    label: 'Все',
    subTitle: '',
    data: [],
  }, {
    value: 'actual',
    label: 'Актуальные',
    data: [],
  }, {
    value: 'online',
    label: 'Онлайн',
    subTitle: '',
    data: [],
  }
];

const tabsComputed = computed(() => tabs);
const subtabsEventsComputed = computed(() => subtabsEvents);

const currentTab = ref(tabs[0].value);
const currentEventSubTab = ref(subtabsEvents[0].value);
</script>

<VTabs
        v-model="currentTab"
        :default-value="tabsComputed[0].value"
        tabs-to-url
        class="view-home__tabs"
      >
        <VTabsList>
          <VTabsTrigger
            v-for="(tab, tabIndex) in tabs"
            :key="tabIndex"
            :value="tab.value"
          >
            {{ tab.label }}
          </VTabsTrigger>
        </VTabsList>
      </VTabs>


<VTabs
        v-model="currentEventSubTab"
        :default-value="subtabsEventsComputed[0].value"
        variant="secondary"
        class="view-home__tabs is--margin-top-20"
      >
        <VTabsList
          variant="secondary"
        >
          <VTabsTrigger
            v-for="(subtab, subtabIndex) in subtabsEvents"
            :key="subtabIndex"
            :value="subtab.value"
            variant="secondary"
          >
            {{ subtab.label }}
          </VTabsTrigger>
        </VTabsList>
      </VTabs>