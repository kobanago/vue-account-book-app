<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/typedef
const props = defineProps<{ btnText: string; disableFormula: boolean }>();
const emits: (evt: 'savedRecord') => void = defineEmits(['savedRecord']);
</script>

<template>
  <v-btn
    class="w-100"
    elevation="12"
    color="primary"
    :text="props.btnText"
    variant="tonal"
    :disabled="props.disableFormula"
    @click="emits('savedRecord')"
  ></v-btn>
</template>
