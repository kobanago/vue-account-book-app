<script setup lang="ts">
import { getTargetDayLogs, groupedLogsByDate, parseDate } from '@/common/func';
import type { DateLogs, LogEntry, SubCategoryEntry } from '@/common/types';
import categoryData from 'samples/features/data/category.json';
import subCategoryData from 'samples/features/data/subcategories.json';
import { type ComputedRef, type Ref, computed, inject, ref, watch } from 'vue';

// eslint-disable-next-line @typescript-eslint/typedef
const props = defineProps<{
  date: string;
  dateLogs: DateLogs[];
}>();
const emits: (
  evt: 'fixRecord',
  addFlg: boolean,
  removeFlg: boolean,
  record: LogEntry | DateLogs,
) => void = defineEmits(['fixRecord']);
const recordId: Ref<number> = inject<Ref<number>>('recordId', ref(0));
const countUpRecordId: () => void = inject<() => void>('countUpRecordId', () => {
  console.log('countUpRecordId');
});
const targetDay: Date | null = parseDate(props.date);
const selectDayLogs: DateLogs[] | null = targetDay
  ? getTargetDayLogs(props.dateLogs, targetDay)
  : null;
const groupedLogs: Record<string, LogEntry[][]> | null = selectDayLogs?.length
  ? groupedLogsByDate(selectDayLogs)
  : null;
const dateGroupAry: string[] = groupedLogs ? Object.keys(groupedLogs) : [];
const flattenedLogs: ComputedRef<LogEntry[]> = computed(() => {
  if (!groupedLogs || !selectedDate.value) return [];
  return groupedLogs[selectedDate.value].flat() ?? [];
});
function getCategoryName(subcategoryId: number): string {
  const categoryId: number = Number(subcategoryId.toString().charAt(0));
  const categoryLabel: string = categoryData[categoryId].category;
  let subcategoryLabel: string = '' as string;

  for (const category of subCategoryData) {
    const subcategory: SubCategoryEntry | undefined = category.subcategories.find(
      (sub: SubCategoryEntry) => sub.id === subcategoryId,
    );
    if (subcategory) {
      subcategoryLabel = subcategory.category;
      break;
    }
  }
  return `${categoryLabel} > ${subcategoryLabel}`;
}
const INIT_LOG: LogEntry = {
  id: 0,
  price: 0,
  category_id: 0,
  subcategory_id: 0,
};
const price: Ref<number> = ref(0);
const selectedCategoryId: Ref<number> = ref(0);
const selectedSubcategoryId: Ref<number> = ref(0);
const selectedDate: Ref<string | null> = ref<string | null>(null);
const selectedLogs: Ref<LogEntry | null> = ref<LogEntry | null>(null);
const newLog: Ref<LogEntry> = ref<LogEntry>(INIT_LOG);
const initDate = () => {
  selectedDate.value = null;
  selectedLogs.value = null;
  price.value = 0;
  selectedCategoryId.value = 0;
  selectedSubcategoryId.value = 0;
};
const clickHandlerFixBtn = () => {
  countUpRecordId();
  newLog.value = {
    id: recordId.value,
    price: price.value,
    category_id: selectedCategoryId.value,
    subcategory_id: selectedSubcategoryId.value,
  };

  emits('fixRecord', true, false, newLog.value);
  const removeLog: DateLogs | undefined = removeSelectedLogs();
  if (!removeLog) return;
  emits('fixRecord', false, true, removeLog);
  initDate();
};

const removeSelectedLogs = () => {
  if (!groupedLogs || !selectDayLogs || !selectedLogs.value || !selectedDate.value) return;
  const { category_id, subcategory_id, price }: LogEntry = selectedLogs.value;
  const target: DateLogs | undefined = selectDayLogs.find(
    (logs: DateLogs) => logs.timestamp.split(' ')[0] === selectedDate.value,
  );
  if (!target) return;
  const targetLogs: LogEntry[] = target.logs.filter(
    (log: LogEntry) =>
      log.category_id !== category_id ||
      log.subcategory_id !== subcategory_id ||
      log.price !== price,
  );
  const targetDateLogs: DateLogs = {
    id: target.id,
    timestamp: target.timestamp,
    registered_date: target.registered_date,
    logs: targetLogs,
  };
  return targetDateLogs;
};

watch(
  [selectedCategoryId, selectedSubcategoryId],
  ([newCategoryId, newSubcategoryId]: [number, number], [oldCategoryId]: [number, number]) => {
    const updatedSubcategoryId: number =
      newCategoryId !== oldCategoryId ? Number(`${newCategoryId}01`) : newSubcategoryId;
    selectedCategoryId.value = newCategoryId;
    selectedSubcategoryId.value = updatedSubcategoryId;
  },
);

watch([selectedDate], ([newDate]: [Ref<string | null>], [oldDate]: [Ref<string | null>]) => {
  if (newDate !== oldDate) selectedLogs.value = null;
});
</script>

<template>
  <v-card>
    <v-card-title class="headline"
      >{{ props.date }}を修正します<br />修正対象のレコードを選択してください</v-card-title
    >
    <v-select
      v-model="selectedDate"
      :items="dateGroupAry"
      label="修正対象の登録日選択"
      placeholder="日付を選択してください"
    ></v-select>
    <v-select
      v-model="selectedLogs"
      :items="flattenedLogs"
      label="修正対象のレコード選択"
      :item-title="
        (item) => (item.price ? `${getCategoryName(item.subcategory_id)} ：￥${item.price}` : '')
      "
      :item-value="(item) => item"
      :disabled="!selectedDate"
      placeholder="ログを選択してください"
    ></v-select>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" sm="6">
          <v-text-field v-model.number="price" label="Price" type="number" required></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-select
            v-model="selectedCategoryId"
            label="Category"
            :items="categoryData"
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
            :items="
              subCategoryData[selectedCategoryId]
                ? subCategoryData[selectedCategoryId].subcategories
                : subCategoryData[0].subcategories
            "
            item-title="category"
            item-value="id"
          ></v-select>
        </v-col>
      </v-row>

      <small class="text-caption text-medium-emphasis">* indicates required field</small>
    </v-card-text>

    <v-divider></v-divider>

    <v-btn
      class="w-100"
      elevation="12"
      color="primary"
      variant="tonal"
      :disabled="
        !price ||
        price <= 0 ||
        !selectedLogs ||
        (selectedLogs.price === price &&
          selectedLogs.category_id === selectedCategoryId &&
          selectedLogs.subcategory_id === selectedSubcategoryId)
      "
      @click="clickHandlerFixBtn"
    >
      SAVE
    </v-btn>
  </v-card>
</template>
