<script setup lang="ts">
import type { LogEntry } from '@/common/types';
import categories from 'samples/features/data/category.json';
import subcategories from 'samples/features/data/subcategories.json';
import { type Ref, inject, ref, watch } from 'vue';

defineProps<{ date: string }>();
const emits: (evt: 'addRecord', log: LogEntry) => void = defineEmits(['addRecord']);
const recordId: Ref<number> = inject<Ref<number>>('recordId', ref(0));
const countUpRecordId: () => void = inject<() => void>('countUpRecordId', () => {
  console.log('countUpRecordId');
});
const selectedCategoryId: Ref<number> = ref(0);
const selectedSubcategoryId: Ref<number> = ref(0);
const price: Ref<number> = ref(0);
const log: Ref<LogEntry> = ref<LogEntry>({
  id: 0,
  price: 0,
  category_id: 0,
  subcategory_id: 0,
});
const initDate = () => {
  price.value = 0;
  selectedCategoryId.value = 0;
  selectedSubcategoryId.value = 0;
};
const clickHandlerAddBtn = () => {
  countUpRecordId();
  emits('addRecord', true, false, log.value);
  initDate();
};

watch(
  [price, selectedCategoryId, selectedSubcategoryId],
  ([newPrice, newCategoryId, newSubcategoryId]: [number, number, number]) => {
    log.value = {
      id: recordId.value,
      price: newPrice,
      category_id: newCategoryId,
      subcategory_id: newSubcategoryId,
    };
  },
);
</script>

<template>
  <v-card>
    <v-card-title class="headline">{{ date }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" sm="6">
          <v-text-field v-model.number="price" label="Price" type="number" required></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-select
            v-model="selectedCategoryId"
            label="Category"
            :items="categories"
            item-title="category"
            item-value="id"
          ></v-select>
        </v-col>
      </v-row>

      <v-row v-show="selectedCategoryId">
        <v-col cols="12" sm="6">
          <v-select
            v-model="selectedSubcategoryId"
            label="Subcategory"
            :items="subcategories[selectedCategoryId].subcategories"
            item-title="category"
            item-value="id"
          ></v-select>
        </v-col>
      </v-row>

      <small class="text-caption text-medium-emphasis">*indicates required field</small>
    </v-card-text>

    <v-divider></v-divider>
    <v-btn
      class="w-100"
      elevation="12"
      color="primary"
      text="SAVE"
      variant="tonal"
      :disabled="!price || 0 >= price"
      @click="clickHandlerAddBtn"
    ></v-btn>
  </v-card>
</template>
