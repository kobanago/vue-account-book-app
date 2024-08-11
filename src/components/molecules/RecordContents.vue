<script setup lang="ts">
import CalendarEl, { type DateLogs, type LogEntry } from '@/components/elements/CalendarEl.vue';
import TitleEl from '@/components/elements/TitleEl.vue';
import EditDialog from '@/components/molecules/EditDialog.vue';
import logsData from 'samples/features/data/logs.json';
import type { CalendarDay } from 'v-calendar/dist/types/src/utils/page.js';
import { watch } from 'vue';
import { type Ref, ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/typedef
const props = defineProps<{ logs: DateLogs[] }>();
const data: Ref<DateLogs[]> = ref(props.logs);
const dates: Ref<Date[]> = ref(logsData.map((log: DateLogs) => new Date(log.registered_date)));
const targetDate: Ref<string> = ref('');
const displayTargetDate: Ref<string> = ref('');
const dataUpdatedCount: Ref<number> = ref(0);
const setDate = (date: CalendarDay) => {
  targetDate.value = date.noonDate.toLocaleDateString();
  displayTargetDate.value = date.ariaLabel;
};
const setRecord = (record: LogEntry[]) => {
  const newData: DateLogs = {
    id: data.value.length + 1,
    registered_date: targetDate.value,
    timestamp: new Date().toLocaleString(),
    logs: record,
  };
  data.value.push(newData);

  const newDate: Date = new Date(targetDate.value);
  if (!dates.value.some((date: Date) => date.toDateString() === newDate.toDateString())) {
    dates.value.push(newDate);
  }
};
watch(data.value, () => {
  dataUpdatedCount.value++;
});
</script>

<template>
  <v-col>
    <TitleEl title="記録を編集する" />
    <h3>{{ displayTargetDate ? displayTargetDate : '日付を選択してください' }}</h3>
    <EditDialog :date="displayTargetDate" @set-saved-record="setRecord" />
    <CalendarEl
      :dates="dates"
      :date-logs="data"
      :data-updated-count="dataUpdatedCount"
      tab="EDIT"
      @set-target-date="setDate"
    />
  </v-col>
</template>
