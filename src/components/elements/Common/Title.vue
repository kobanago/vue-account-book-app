<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <v-col justify="center" class="ma-2">
    <h2 class="text-basil text-left">{{ title }}</h2>
  </v-col>
</template>

<style>
.text-basil {
  color: #356859 !important;
}
</style>
