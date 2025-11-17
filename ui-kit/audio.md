---
layout: uikit-single
title: Audio Player
slug: audio
draft: false
publishDate: 2025-10-13
tags:
  - ui-kit
---

`VAudioPlayer` is a custom, accessible audio player with play/pause, progress seek, volume controls, optional download button, and keyboard navigation support.

## Location
```src/core/components/VAudioPlayer/VAudioPlayer.vue```

## When to use
- **Inline audio playback**: Articles, audio galleries, or any page needing a consistent player UI.
- **Multiple players**: Use `stopOthersOnPlay` to pause other players when a new one starts.

## Quick start
You can use the player in two ways: pass a `src` prop (simple) or provide your own `<audio>` element via slot (advanced).

### A) Props-based (simple)
```vue
<script setup lang="ts">
import VAudioPlayer from '@/core/components/VAudioPlayer/VAudioPlayer.vue'

const fileUrl = 'https://example.com/audio/file.mp3'
</script>

<template>
  <VAudioPlayer
    :src="fileUrl"
    title="Sample audio"
    :stopOthersOnPlay="true"
    :showDownloadButton="true"
    downloadUrl="https://example.com/audio/file.mp3"
    downloadTitle="sample-audio"
    :enableKeystrokes="true"
  />
</template>
```

### B) Slot-based (advanced)
When you need full control of the `<audio>` element (custom attributes, sources, etc.).
```vue
<script setup lang="ts">
import VAudioPlayer from '@/core/components/VAudioPlayer/VAudioPlayer.vue'
</script>

<template>
  <VAudioPlayer :stopOthersOnPlay="true" :enableKeystrokes="true">
    <audio
      src="https://example.com/audio/file.mp3"
      title="Custom audio"
    ></audio>
  </VAudioPlayer>
  
</template>
```

## Props
- **src**: `string` (default: `''`)
  - Audio file URL. If omitted, provide an `<audio>` element in the default slot.
- **title**: `string` (default: `''`)
  - Used for accessibility and the download filename fallback.
- **downloadUrl**: `string` (default: `''`)
  - Custom URL for the download button; falls back to the audio `src`.
- **downloadTitle**: `string` (default: `''`)
  - Filename for downloads; falls back to `title` or `'audio'`.
- **stopOthersOnPlay**: `boolean` (default: `false`)
  - When true, pauses any other `<audio>` elements on the page when this player starts.
- **showDownloadButton**: `boolean` (default: `false`)
  - Shows a download button that uses `downloadUrl`/`downloadTitle`.
- **enableKeystrokes**: `boolean` (default: `false`)
  - Enables keyboard navigation styles and handlers on key controls.
- **showTooltips**: `boolean` (default: `false`)
  - Reserved for future UI hints; not currently used for visible tooltips.

## Accessibility & Controls
- Play/Pause, Volume, and Download controls expose `aria-label`s and accept keyboard interaction when `enableKeystrokes` is true.
- Time and volume sliders expose `role="slider"` and value attributes for assistive tech.

## Styling
The component uses styles from `src/core/styles/components/_audio.scss` and renders with the `.green-audio-player` class. It is responsive down to mobile widths and hides the native `<audio>` controls.

## Tips
- Prefer the props-based approach for simplicity; switch to slot-based when you need custom `<audio>` markup.
- For pages with many players, set `stopOthersOnPlay` to maintain a clean listening experience.
- Ensure audio files have correct CORS headers if hosted externally.


