<script setup lang="ts">
import ConsiderContents from '@/components/molecules/ConsiderContents.vue';
import RecordContents from '@/components/molecules/RecordContents.vue';
import WatchContents from '@/components/molecules/WatchContents.vue';
import { type Ref, ref } from 'vue';

const items: Ref<string[]> = ref(['Watch', 'Record', 'Consider']);
const tab: Ref<string> = ref('Watch');
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
            <WatchContents />
          </v-card>
          <v-card v-else-if="tab === items[1]">
            <RecordContents />
          </v-card>
          <v-card v-else-if="tab === items[2]">
            <ConsiderContents />
          </v-card>
        </v-card>
      </v-window-item>
    </v-window>
  </v-card>
</template>
