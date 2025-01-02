<script setup lang="ts">
import { BTN_TEXT } from '@/common/const';
import type { DateLogs, LogEntry } from '@/common/types';
import TitleEl from '@/components/elements/TitleEl.vue';
import EditDialog from '@/components/molecules/EditDialog.vue';
import logsData from 'samples/features/data/logs.json';
import type { CalendarDay } from 'v-calendar/dist/types/src/utils/page.js';
import { watch } from 'vue';
import { type Ref, ref } from 'vue';
import CalendarEl from '../elements/CalendarEl.vue';

// eslint-disable-next-line @typescript-eslint/typedef
const props = defineProps<{
  logs: DateLogs[];
  logsId: number;
}>();
const data: Ref<DateLogs[]> = ref(props.logs);
const dates: Ref<Date[]> = ref(logsData.map((log: DateLogs) => new Date(log.registered_date)));
const targetDate: Ref<string> = ref('');
const displayTargetDate: Ref<string> = ref('');
const dataUpdatedCount: Ref<number> = ref(0);
const btnTextArray: Ref<string[]> = ref(BTN_TEXT);
const setDate = (date: CalendarDay) => {
  targetDate.value = date.noonDate.toLocaleDateString();
  displayTargetDate.value = date.ariaLabel;
};
const setRecord = (removeId: number, record?: LogEntry) => {
  if (!removeId && record) createNewData(record);
  if (removeId) removeData(removeId);
};
const emits: (evt: 'countUpLogsId') => void = defineEmits(['countUpLogsId']);
const createNewData = (record: LogEntry) => {
  const existRegisterDay: DateLogs | undefined = data.value.find(
    (item: DateLogs) =>
      item.registered_date === targetDate.value &&
      item.timestamp.split(' ')[0] === new Date().toLocaleString().split(' ')[0],
  );
  if (existRegisterDay) {
    existRegisterDay.logs.push(record);
  } else {
    emits('countUpLogsId');
    const newData: DateLogs = {
      id: props.logsId,
      registered_date: targetDate.value,
      timestamp: new Date().toLocaleString(),
      logs: [record],
    };
    data.value.push(newData);
  }

  const newDate: Date = new Date(targetDate.value);
  if (!dates.value.some((date: Date) => date.toDateString() === newDate.toDateString())) {
    dates.value.push(newDate);
  }
};

const removeData = (id: number) => {
  const updatedData: DateLogs[] = data.value.filter((item: DateLogs) =>
    item.logs.filter((log: LogEntry) => log.id !== id),
  );
  data.value = [...updatedData];
};

watch(
  () => data.value.map((item: DateLogs) => ({ ...item })),
  () => {
    dataUpdatedCount.value++;
  },
  { deep: true },
);
</script>

<template>
  <v-col>
    <TitleEl title="記録を編集する" />
    <h3>{{ displayTargetDate ? displayTargetDate : '日付を選択してください' }}</h3>
    <v-row justify="center">
      <v-col v-for="btnText in btnTextArray" :key="btnText">
        <EditDialog
          :date="displayTargetDate"
          :btn-text="btnText"
          :date-logs="data"
          :data-updated-count="dataUpdatedCount"
          @set-record="setRecord"
        />
      </v-col>
    </v-row>
    <CalendarEl
      :dates="dates"
      :date-logs="data"
      :data-updated-count="dataUpdatedCount"
      tab="EDIT"
      @set-target-date="setDate"
    />
  </v-col>
</template>
