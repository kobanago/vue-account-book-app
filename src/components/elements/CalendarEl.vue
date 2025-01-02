<script setup lang="ts">
import { getTargetDayLogs, groupedLogsByDate } from '@/common/func';
import type {
  CategoryEntry,
  DateLogs,
  LogEntry,
  SubCategory,
  SubCategoryEntry,
} from '@/common/types';
import categoryData from 'samples/features/data/category.json';
import subCategoryData from 'samples/features/data/subcategories.json';
import { Calendar as VCalendar } from 'v-calendar';
import type { CalendarDay } from 'v-calendar/dist/types/src/utils/page.js';
import 'v-calendar/style.css';
import { type Ref, ref, watch } from 'vue';
import CalendarWatch from './CalendarWatch.vue';

// eslint-disable-next-line @typescript-eslint/typedef
const props = defineProps<{
  dates: Date[];
  dateLogs: DateLogs[];
  tab: string;
  dataUpdatedCount?: number;
}>();
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
const selectedDate: Ref<CalendarDay | null> = ref(null);
const selectedDateLogs: Ref<string> = ref('');
const isExistData: Ref<boolean> = ref(false);
const dayTotal: Ref<number> = ref(0);
const emits: (evt: 'setTargetDate', day: CalendarDay) => void = defineEmits<{
  setTargetDate: [day: CalendarDay];
}>();

const setCalendarData = (date: CalendarDay) => {
  const targetDay: Date = new Date(date.year, date.month - 1, date.day);
  const isIncludesDay: boolean = Array.from(props.dates).some(
    (date: Date) => date.toDateString() === targetDay.toDateString(),
  );

  const stringifyArray = (arr: LogEntry[]): string => {
    return arr
      .map((obj: LogEntry): string => {
        const category: CategoryEntry | undefined = categoryData.find(
          (target: CategoryEntry) => target.id === obj.category_id,
        );
        if (!category) return '';

        const targetSubcategory: SubCategory | undefined = subCategoryData.find(
          (sub: SubCategory) => sub.id === category.id,
        );
        if (!targetSubcategory) return '';

        const subcategory: SubCategoryEntry | undefined = targetSubcategory.subcategories.find(
          (sub: SubCategoryEntry) => sub.id === obj.subcategory_id,
        );

        const categoryName: string = subcategory
          ? `${category.category} > ${subcategory.category}`
          : category.category;

        const formattedPrice: string = obj.price.toLocaleString('ja-JP', {
          style: 'currency',
          currency: 'JPY',
        });

        const entry: string = `${categoryName}：${formattedPrice}`;
        return entry;
      })
      .join('\n');
  };

  const reflectData = (isExistDay: boolean, day: Date): void => {
    if (isExistDay) {
      isExistData.value = true;
      const dayLogs: DateLogs[] = getTargetDayLogs(props.dateLogs, day);

      dayTotal.value = dayLogs.reduce((acc: number, log: DateLogs) => {
        const logTotal: number = log.logs.reduce((logAcc: number, entry: LogEntry) => {
          return logAcc + entry.price;
        }, 0);
        return acc + logTotal;
      }, 0);

      const resultString: string = Object.entries(groupedLogsByDate(dayLogs))
        .map(([date, groupedLogs]: [string, LogEntry[][]]) => {
          const logsString: string = groupedLogs
            .map((groupedLog: LogEntry[]) => stringifyArray(groupedLog))
            .join('\n');
          return `登録日: ${date}\n\n${logsString}`;
        })
        .join('\n\n\n');

      selectedDateLogs.value = resultString;
    } else {
      isExistData.value = false;
      selectedDateLogs.value = '記録されていません';
    }
  };
  reflectData(isIncludesDay, targetDay);
};

const handleDayClick = (date: CalendarDay): void => {
  selectedDate.value = date;
  setCalendarData(date);
  if (props.tab === 'EDIT') {
    emits('setTargetDate', selectedDate.value);
  }
};

watch(
  () => props.dataUpdatedCount,
  () => {
    if (selectedDate.value) {
      setCalendarData(selectedDate.value);
    }
  },
);
</script>

<template>
  <v-col justify="center" class="ma-2">
    <VCalendar expanded :attributes="attrs" @dayclick="handleDayClick">
      <template #footer>
        <v-col justify="center" class="ma-2">
          <v-card>
            <v-card-title class="text-center justify-center py-2">{{
              selectedDate?.ariaLabel
            }}</v-card-title>
            <CalendarWatch
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
