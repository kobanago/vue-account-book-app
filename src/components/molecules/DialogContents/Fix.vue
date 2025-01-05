<script setup lang="ts">
import { BTN_TEXT } from '@/common/const';
import type { DateLogs, LogEntry, SetRecordEmits, SubCategoryEntry } from '@/common/types';
import { getTargetDayLogs, groupedLogsByDate, parseDate } from '@/common/utiles';
import UpdateRecordSave from '@/components/atoms/Buttons/UpdateRecordSave.vue';
import categoryData from 'samples/features/data/category.json';
import subCategoryData from 'samples/features/data/subcategories.json';
import { type ComputedRef, type Ref, computed, inject, ref, watch } from 'vue';
import Add from '../DaialogButtons/Add.vue';

// eslint-disable-next-line @typescript-eslint/typedef
const props = defineProps<{
  date: string;
  dateLogs: DateLogs[];
}>();
const emits: SetRecordEmits = defineEmits(['setRecord']);
const recordId: Ref<number> = inject<Ref<number>>('recordId', ref(0));
const countUpRecordId: () => void = inject<() => void>('countUpRecordId', () => {});
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
const selectedDate: Ref<string | null> = ref<string | null>(null);
const selectedLogs: Ref<LogEntry | null> = ref<LogEntry | null>(null);
// add用変数
const price: Ref<number> = ref(0);
const selectedCategoryId: Ref<number> = ref(0);
const selectedSubcategoryId: Ref<number> = ref(0);
const priceRef: ComputedRef<Ref<number>> = computed(() => price);
const categoryIdRef: ComputedRef<Ref<number>> = computed(() => selectedCategoryId);
const subcategoryIdRef: ComputedRef<Ref<number>> = computed(() => selectedSubcategoryId);
const changeHandlerRecordValue = (target: Ref<number>, val: number) => {
  target.value = val;
};
const clickHandlerFixBtn = () => {
  countUpRecordId();
  emits('setRecord', 0, {
    id: recordId.value,
    price: price.value,
    category_id: selectedCategoryId.value,
    subcategory_id: selectedSubcategoryId.value,
  });
  if (!selectedLogs.value?.id) return;
  emits('setRecord', selectedLogs.value.id, undefined);
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
      <Add
        :price-ref="priceRef"
        :category-id-ref="categoryIdRef"
        :subcategory-id-ref="subcategoryIdRef"
        @change-record="changeHandlerRecordValue"
      />
    </v-card-text>
    <UpdateRecordSave
      :btn-text="BTN_TEXT[1]"
      :disable-formula="
        !price ||
        price <= 0 ||
        !selectedLogs ||
        (selectedLogs.price === price &&
          selectedLogs.category_id === selectedCategoryId &&
          selectedLogs.subcategory_id === selectedSubcategoryId)
      "
      @saved-record="clickHandlerFixBtn"
    />
  </v-card>
</template>
