<script setup lang="ts">
import { INIT_LOG } from '@/common/const';
import type { LogEntry, SetRecordEmits } from '@/common/types';
import categories from 'samples/features/data/category.json';
import subcategories from 'samples/features/data/subcategories.json';
import { type Ref, inject, ref, watch } from 'vue';

defineProps<{ date: string }>();
const emits: SetRecordEmits = defineEmits(['setRecord']);
const recordId: Ref<number> = inject<Ref<number>>('recordId', ref(0));
const countUpRecordId: () => void = inject<() => void>('countUpRecordId', () => {
  console.log('RecordIdError');
});
const selectedCategoryId: Ref<number> = ref(0);
const selectedSubcategoryId: Ref<number> = ref(0);
const price: Ref<number> = ref(0);
const log: Ref<LogEntry> = ref<LogEntry>(INIT_LOG);
const initDate = () => {
  price.value = 0;
  selectedCategoryId.value = 0;
  selectedSubcategoryId.value = 0;
};
const clickHandlerAddBtn = () => {
  countUpRecordId();
  emits('setRecord', 0, log.value);
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
