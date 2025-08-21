---
layout: uikit-single
title: Slider
slug: slider
draft: false
publishDate: 2024-10-10
tags:
  - ui-kit
---

<script setup lang="ts">
import VSliderSwiper from 'UiKit/components/VSlider/VSliderSwiper.vue';
import { SwiperSlide } from 'swiper/vue';
</script>

<VSliderSwiper
    show-navigation
    :slides-per-view="5"
    :space-between="10"
    :loop="true"
    :lazy="true"
    :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
    }"
>
    <SwiperSlide
        v-for="(item, index) in 6"
        :key="index + 1"
    >
        <img :src="`https://picsum.photos/200/300?random=${index}`" class="is--margin-top-0">
    </SwiperSlide>
</VSliderSwiper>


#### To add in markdown
```
::::: slider
::: slider-item {src="https://filer-api.advayta.org/v1.0/public/files/72423?size=medium"}
:::
::: slider-item {src="https://filer-api.advayta.org/v1.0/public/files/72424?size=medium"}
:::
:::::
```