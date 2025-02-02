<script setup lang="ts">
import { BTN_TEXT } from '@/common/const';
import type { DateLogs, LogEntry, SetRecordEmits } from '@/common/types';
import { parseDate } from '@/common/utiles';
import Add from './DialogContents/Add.vue';
import Fix from './DialogContents/Fix.vue';

// eslint-disable-next-line @typescript-eslint/typedef
const props = defineProps<{
  date: string;
  btnText: string;
  dateLogs: DateLogs[];
  dataUpdatedCount?: number;
}>();

const emits: SetRecordEmits = defineEmits(['setRecord']);
const setRecord = (removeId: number, record?: LogEntry) => {
  emits('setRecord', removeId, record);
  alert(`データが${props.btnText}されました！`);
};
const compareDates = (dateStr1: string, dateStr2: string): boolean | null => {
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
          <Add :key="dataUpdatedCount" :date="date" @set-record="setRecord" />
        </v-card>
        <v-card v-if="btnText === BTN_TEXT[1]">
          <Fix :key="dataUpdatedCount" :date="date" :date-logs="dateLogs" @set-record="setRecord" />
        </v-card>
        <v-card v-if="btnText === BTN_TEXT[2]">
          <Add :key="dataUpdatedCount" :date="date" :date-logs="dateLogs" @set-record="setRecord" />
        </v-card>
      </v-dialog>
    </v-col>
  </v-container>
</template>
