<script setup lang="ts">
import type { DateLogs, LogEntry } from '@/common/types';
import CalendarEl from '@/components/elements/CalendarEl.vue';
import PriceEl from '@/components/elements/PriceEl.vue';
import TitleEl from '@/components/elements/TitleEl.vue';
import { type Ref, reactive, ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/typedef
const props = defineProps<{ logs: DateLogs[] }>();
const data: DateLogs[] = reactive(props.logs);
const today: Date = new Date();
const todayStr: Ref<string> = ref(today.toLocaleDateString());
const dates: Date[] = data.map((log: DateLogs) => new Date(log.registered_date));
const recalculateMonthTotal = (
  year: number = today.getFullYear(),
  month: number = today.getMonth(),
) => {
  const monthLogs: DateLogs[] = data.filter((log: DateLogs) => {
    const logDate: Date = new Date(log.registered_date);
    return logDate.getFullYear() === year && logDate.getMonth() === month;
  });
  const monthTotal: number = calculateMonthTotal(monthLogs);
  return monthTotal;
};
const calculateMonthTotal = (logs: DateLogs[]) => {
  return logs.reduce((acc: number, log: DateLogs) => {
    return acc + log.logs.reduce((logAcc: number, entry: LogEntry) => logAcc + entry.price, 0);
  }, 0);
};
const totalExpense: number = recalculateMonthTotal();
const incomes: Ref<number> = ref(1000);
const expenses: Ref<number> = ref(totalExpense);
</script>

<template>
  <v-col>
    <TitleEl :title="`今月の収支(${todayStr}時点)`" />
    <v-row justify="center">
      <PriceEl title="収入" :total="incomes" font-color="text-light-green-darken-3" />
      <PriceEl title="支出" :total="expenses" font-color="text-red-darken-4" />
    </v-row>
    <CalendarEl :dates="dates" :date-logs="data" tab="WATCH" />
  </v-col>
</template>
