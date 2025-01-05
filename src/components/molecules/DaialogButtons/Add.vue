<script setup lang="ts">
import type { ChangeRecordRefEmits } from '@/common/types';
import categories from 'samples/features/data/category.json';
import subcategories from 'samples/features/data/subcategories.json';
import { type Ref, ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/typedef
const props = defineProps<{
  priceRef: Ref<number>;
  categoryIdRef: Ref<number>;
  subcategoryIdRef: Ref<number>;
}>();
const emits: ChangeRecordRefEmits = defineEmits(['changeRecord']);
const price: Ref<number> = ref(0);
const categoryId: Ref<number> = ref(0);
const subcategoryId: Ref<number> = ref(0);
</script>

<template>
  <v-row>
    <v-col cols="12" md="4" sm="6">
      <v-text-field
        v-model.number="price"
        :value="price"
        label="Price"
        type="number"
        required
        @input="emits('changeRecord', props.priceRef, price)"
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="6">
      <v-select
        v-model="categoryId"
        label="Category"
        :items="categories"
        item-title="category"
        item-value="id"
        @update:model-value="emits('changeRecord', props.categoryIdRef, categoryId)"
      ></v-select>
    </v-col>
  </v-row>

  <v-row v-show="categoryId">
    <v-col cols="12" sm="6">
      <v-select
        v-model="subcategoryId"
        label="Subcategory"
        :items="subcategories[categoryId].subcategories"
        item-title="category"
        item-value="id"
        @update:model-value="emits('changeRecord', props.subcategoryIdRef, subcategoryId)"
      ></v-select>
    </v-col>
  </v-row>

  <small class="text-caption text-medium-emphasis">*indicates required field</small>
</template>
