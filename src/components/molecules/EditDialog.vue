<script setup lang="ts">
import categories from 'samples/features/data/category.json';
import subcategories from 'samples/features/data/subcategories.json';
import { type Ref, ref } from 'vue';
import type { LogEntry } from '../elements/CalendarEl.vue';

defineProps<{ date: string }>();
const selectedCategoryId: Ref<number> = ref(0);
const selectedSubcategoryId: Ref<number> = ref(0);
const isOpenDialog: Ref<boolean> = ref(false);
const price: Ref<number> = ref(0);
const emits: (evt: 'setSavedRecord', log: LogEntry[]) => void = defineEmits(['setSavedRecord']);
const recordAry: Ref<LogEntry[]> = ref([]);

const setRecord = () => {
  const record: LogEntry = {
    price: price.value,
    category_id: selectedCategoryId.value,
    subcategory_id: selectedSubcategoryId.value,
  };
  recordAry.value.push(record);
  //初期化
  price.value = 0;
  selectedCategoryId.value = 0;
  selectedSubcategoryId.value = 0;
  alert('データが登録されました！');
};
const closeDialog = () => {
  isOpenDialog.value = false;
  emits('setSavedRecord', recordAry.value);
};
</script>

<template>
  <v-container>
    <v-col>
      <v-dialog v-model="isOpenDialog" width="auto" scrollable>
        <template #activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" text="編集" :disabled="date === ''"></v-btn>
        </template>

        <v-card>
          <v-card-title class="headline">{{ date }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model.number="price"
                  label="Price"
                  type="number"
                  required
                ></v-text-field>
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

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="plain" @click="closeDialog"></v-btn>
            <v-btn
              color="primary"
              text="Save"
              variant="tonal"
              :disabled="!price || 0 >= price"
              @click="setRecord"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-container>
</template>
