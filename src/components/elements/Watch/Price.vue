<script setup lang="ts">
defineProps<{ title: string; total: number; fontColor: string }>();
</script>

<template>
  <div class="ma-3">
    <p class="font-weight-bold text-h5">{{ title }}</p>
    <h3 class="font-weight-bold text-h3" :class="fontColor">
      {{ total.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }) }}
    </h3>
  </div>
</template>
