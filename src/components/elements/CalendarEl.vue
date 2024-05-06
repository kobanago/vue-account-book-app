<script setup lang="ts">
import data from 'samples/features/data/subcategories.json';
import { Calendar as VCalendar } from 'v-calendar';
import type { CalendarDay } from 'v-calendar/dist/types/src/utils/page.js';
import 'v-calendar/style.css';
import { type Ref, ref } from 'vue';
import CalendarRecord from './CalendarRecord.vue';
import CalendarWatch from './CalendarWatch.vue';

export type LogEntry = {
  category_id: number;
  price: number;
};
export type DateLogs = {
  id: number;
  time: string;
  logs: LogEntry[];
};
export type SubCategoryEntry = {
  id: number;
  name: string;
};
export type SubCategory = {
  id: number;
  subcategories: SubCategoryEntry[];
};
// eslint-disable-next-line @typescript-eslint/typedef
const props = defineProps<{ dates: Date[]; dateLogs: DateLogs[]; tab: string }>();
const today: Date = new Date();
interface Attribute {
  key: string;
  highlight: boolean | { color: string };
  dates: Date[];
}
const initialAttrs: Attribute[] = [
  {
    key: 'today',
    highlight: {
      color: 'green',
    },
    dates: [today],
  },
  {
    key: 'record',
    highlight: true,
    dates: props.dates,
  },
];
const attrs: Ref<Attribute[]> = ref(initialAttrs);
const selectedDate: Ref<string> = ref('');
const selectedDateLogs: Ref<string> = ref('');
const isExistData: Ref<boolean> = ref(false);
const dayTotal: Ref<number> = ref(0);

const handleDayClick = (date: CalendarDay) => {
  selectedDate.value = date.ariaLabel;
  const day: Date = new Date(date.year, date.month - 1, date.day);
  const dayStr: string = day.toDateString();
  const dayFullStr: string = day.toLocaleString();
  const includesDay: boolean = Array.from(props.dates).some(
    (date: Date) => date.toDateString() === dayStr,
  );
  const stringifyArray = (arr: LogEntry[], time: string) => {
    return arr
      .map((obj: LogEntry, objIndex: number) => {
        const subcategory: SubCategory | undefined = data.find((category: SubCategory) =>
          category.subcategories.find((sub: SubCategoryEntry) => sub.id === obj.category_id),
        );
        const categoryName: string = subcategory
          ? (subcategory.subcategories.find((sub: SubCategoryEntry) => sub.id === obj.category_id)
              ?.name as string)
          : '';
        const formattedPrice: string = obj.price.toLocaleString('ja-JP', {
          style: 'currency',
          currency: 'JPY',
        });
        const entry: string = `${categoryName}：${formattedPrice}`;
        return objIndex === 0 ? `日時: ${time}\n\n${entry}` : entry;
      })
      .join('\n');
  };

  if (includesDay) {
    isExistData.value = true;
    const dayLogs: DateLogs[] = props.dateLogs.filter((item: DateLogs) => {
      return item.time.split(' ')[0] === dayFullStr.split(' ')[0];
    });

    dayTotal.value = dayLogs.reduce((acc: number, log: DateLogs) => {
      const logTotal: number = log.logs.reduce((logAcc: number, entry: LogEntry) => {
        return logAcc + entry.price;
      }, 0);
      return acc + logTotal;
    }, 0);

    const resultString: string = dayLogs
      .map((item: DateLogs) => stringifyArray(item.logs, item.time))
      .join('\n\n\n');
    selectedDateLogs.value = resultString;
  } else {
    isExistData.value = false;
    selectedDateLogs.value = '記録されていません';
  }
};
</script>

<template>
  <v-col justify="center" class="ma-2">
    <VCalendar expanded :attributes="attrs" @dayclick="handleDayClick">
      <template #footer>
        <v-col justify="center" class="ma-2">
          <v-card>
            <v-card-title class="text-center justify-center py-2">{{ selectedDate }}</v-card-title>
            <CalendarWatch
              v-if="props.tab === 'WATCH'"
              :total="dayTotal"
              :is-exist-data="isExistData"
              :selected-date-logs="selectedDateLogs"
            />
            <CalendarRecord
              v-else-if="props.tab === 'RECORD'"
              :total="dayTotal"
              :is-exist-data="isExistData"
              :selected-date-logs="selectedDateLogs"
            />
          </v-card>
        </v-col>
      </template>
    </VCalendar>
  </v-col>
</template>
