<script setup lang="ts">
import type { LogEntry } from '@/common/types';
import categories from 'samples/features/data/category.json';
import subcategories from 'samples/features/data/subcategories.json';
import { type Ref, ref, watch } from 'vue';

defineProps<{ date: string }>();
const selectedCategoryId: Ref<number> = ref(0);
const selectedSubcategoryId: Ref<number> = ref(0);
const price: Ref<number> = ref(0);
const emits: (evt: 'addRecord', log: LogEntry) => void = defineEmits(['addRecord']);
const log: Ref<LogEntry> = ref<LogEntry>({
  price: 0,
  category_id: 0,
  subcategory_id: 0,
});

watch(
  [price, selectedCategoryId, selectedSubcategoryId],
  ([newPrice, newCategoryId, newSubcategoryId]: [number, number, number]) => {
    log.value = {
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
      elevation="12"
      color="primary"
      text="Save"
      variant="tonal"
      :disabled="!price || 0 >= price"
      @click="emits('addRecord', log)"
    ></v-btn>
  </v-card>
</template>
