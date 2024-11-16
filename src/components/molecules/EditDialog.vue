<script setup lang="ts">
import { BTN_TEXT } from '@/common/const';
import type { DateLogs, LogEntry } from '@/common/types';
import { type Ref, ref } from 'vue';
import AddDialogContents from './AddDialogContents.vue';

// eslint-disable-next-line @typescript-eslint/typedef
const props = defineProps<{ date: string; btnText: string; dateLogs: DateLogs[] }>();
const emits: (evt: 'setSavedRecord', log: LogEntry[], btnText: string) => void = defineEmits([
  'setSavedRecord',
]);
const recordAry: Ref<LogEntry[]> = ref([]);

const setRecord = (record: LogEntry) => {
  recordAry.value.push(record);
  emits('setSavedRecord', recordAry.value, props.btnText);
  alert(`データが${props.btnText}されました！`);
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
  if (props.btnText === BTN_TEXT[0]) return false;
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
        <v-card v-if="btnText === BTN_TEXT[0]">
          <AddDialogContents :date="date" @add-record="setRecord" />
        </v-card>
        <v-card v-if="btnText === BTN_TEXT[1]">
          <AddDialogContents :date="date" @fix-record="setRecord" />
        </v-card>
        <v-card v-if="btnText === BTN_TEXT[2]">
          <AddDialogContents :date="date" @add-record="setRecord" />
        </v-card>
      </v-dialog>
    </v-col>
  </v-container>
</template>
