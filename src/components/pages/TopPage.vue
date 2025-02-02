<script setup lang="ts">
import type { DateLogs } from '@/common/types';
import Consider from '@/components/templates/Contents/Consider.vue';
import Record from '@/components/templates/Contents/Record.vue';
import Watch from '@/components/templates/Contents/Watch.vue';
import logsData from 'samples/features/data/logs.json';
import { type Ref, provide, ref } from 'vue';

const items: Ref<string[]> = ref(['Watch', 'Record', 'Consider']);
const tab: Ref<string> = ref('Record');
const logs: Ref<DateLogs[]> = ref(logsData);
const logsLen: number = logsData.length;
const recordLen: number = logsData.reduce(
  (total: number, item: DateLogs) => total + item.logs.length,
  0,
);
const logTotalLastNum: Ref<number> = ref(logsLen + 1);
const recordTotalLastNum: Ref<number> = ref(recordLen + 1);
const countUpLogsId = () => ++logTotalLastNum.value;
const countUpRecordId = () => ++recordTotalLastNum.value;
provide('recordId', recordTotalLastNum);
provide('countUpRecordId', countUpRecordId);

const text: string =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
</script>

<template>
  <v-card color="basil" class="bg-amber-lighten-5">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold text-h2 text-basil">Payments</h1>
    </v-card-title>

    <v-tabs v-model="tab" bg-color="transparent" color="basil" grow>
      <v-tab v-for="item in items" :key="item" :value="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item v-for="item in items" :key="item" :value="item">
        <v-card color="basil" class="bg-amber-lighten-5" flat>
          <v-card-text>{{ text }}</v-card-text>
          <v-card v-if="tab === items[0]">
            <Watch :logs="logs" />
          </v-card>
          <v-card v-else-if="tab === items[1]">
            <Record :logs="logs" :logs-id="logTotalLastNum" @count-up-logs-id="countUpLogsId" />
          </v-card>
          <v-card v-else-if="tab === items[2]">
            <Consider />
          </v-card>
        </v-card>
      </v-window-item>
    </v-window>
  </v-card>
</template>
