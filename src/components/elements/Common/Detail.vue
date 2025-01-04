<script setup lang="ts">
import 'v-calendar/style.css';
import { type Ref, ref } from 'vue';

defineProps<{ total: number; isExistData: boolean; selectedDateLogs: string }>();
const isShowDetail: Ref<boolean> = ref(false);
</script>

<template>
  <v-card>
    <div v-show="isExistData">
      <v-card-title
        >総計：{{
          total.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })
        }}</v-card-title
      >
      <v-btn class="my-4" type="button" @click="isShowDetail = !isShowDetail"
        >詳細を{{ isShowDetail ? '閉じる' : '開く' }}</v-btn
      >
    </div>
    <v-card-text
      v-show="isShowDetail || !isExistData"
      style="white-space: pre-wrap"
      v-text="selectedDateLogs"
    ></v-card-text>
  </v-card>
</template>
