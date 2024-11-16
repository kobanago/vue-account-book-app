<script setup lang="ts">
import categories from 'samples/features/data/category.json';
import subcategories from 'samples/features/data/subcategories.json';
import { type Ref, ref } from 'vue';
import type { DateLogs, LogEntry } from '../elements/CalendarEl.vue';

// eslint-disable-next-line @typescript-eslint/typedef
const props = defineProps<{ date: string; btnText: string; dateLogs: DateLogs[] }>();
const selectedCategoryId: Ref<number> = ref(0);
const selectedSubcategoryId: Ref<number> = ref(0);
const price: Ref<number> = ref(0);
const emits: (evt: 'setSavedRecord', log: LogEntry[], btnText: string) => void = defineEmits([
  'setSavedRecord',
]);
const recordAry: Ref<LogEntry[]> = ref([]);

const setRecord = () => {
  const record: LogEntry = {
    price: price.value,
    category_id: selectedCategoryId.value,
    subcategory_id: selectedSubcategoryId.value,
  };
  recordAry.value.push(record);
  emits('setSavedRecord', recordAry.value, props.btnText);
  alert('データが登録されました！');
  initDate();
};
const initDate = () => {
  //初期化
  price.value = 0;
  selectedCategoryId.value = 0;
  selectedSubcategoryId.value = 0;
  recordAry.value = [];
};
const parseDate = (dateStr: string) => {
  // '2024/7/23' の形式を処理
  if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateStr)) {
    const [year, month, day]: number[] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  // '2024年11月11日月曜日' の形式を処理
  const jpDateMatch: RegExpMatchArray | null = dateStr.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (jpDateMatch) {
    const [, year, month, day]: number[] = jpDateMatch.map(Number);
    return new Date(year, month - 1, day);
  }
  return null;
};

const compareDates = (dateStr1: string, dateStr2: string) => {
  const date1: Date | null = parseDate(dateStr1);
  const date2: Date | null = parseDate(dateStr2);
  return date1 && date2 && date1.getTime() === date2.getTime();
};
const disabledFlg = () => {
  if (!props.date) return true;
  if (props.btnText === '追加') return false;
  if (!props.dateLogs.length) return true;
  const isIncludesDay: boolean = Array.from(props.dateLogs).some((date: DateLogs) => {
    return compareDates(props.date, date.registered_date);
  });
  return !isIncludesDay;
};
</script>

<template>
  <v-container>
    <v-col>
      <v-dialog width="auto" scrollable>
        <template #activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" :text="btnText" :disabled="disabledFlg()"></v-btn>
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
          <v-btn
            elevation="12"
            color="primary"
            text="Save"
            variant="tonal"
            :disabled="!price || 0 >= price"
            @click="setRecord"
          ></v-btn>
        </v-card>
      </v-dialog>
    </v-col>
  </v-container>
</template>
