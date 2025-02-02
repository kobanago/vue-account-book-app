<script setup lang="ts">
import { BTN_TEXT } from '@/common/const';
import type { SetRecordEmits } from '@/common/types';
import UpdateRecordSave from '@/components/atoms/Buttons/UpdateRecordSave.vue';
import { type ComputedRef, type Ref, computed, inject, ref } from 'vue';
import Add from '../DaialogButtons/Add.vue';

defineProps<{ date: string }>();
const emits: SetRecordEmits = defineEmits(['setRecord']);
const recordId: Ref<number> = inject<Ref<number>>('recordId', ref(0));
const countUpRecordId: () => void = inject<() => void>('countUpRecordId', () => {});
const price: Ref<number> = ref(0);
const categoryId: Ref<number> = ref(0);
const subcategoryId: Ref<number> = ref(0);
const priceRef: ComputedRef<Ref<number>> = computed(() => price);
const categoryIdRef: ComputedRef<Ref<number>> = computed(() => categoryId);
const subcategoryIdRef: ComputedRef<Ref<number>> = computed(() => subcategoryId);
const changeHandlerRecordValue = (target: Ref<number>, val: number) => {
  target.value = val;
};
const clickHandlerAddBtn = () => {
  countUpRecordId();
  emits('setRecord', 0, {
    id: recordId.value,
    price: price.value,
    category_id: categoryId.value,
    subcategory_id: subcategoryId.value,
  });
};
</script>

<template>
  <v-card>
    <v-card-title class="headline">{{ date }}</v-card-title>
    <v-card-text>
      <Add
        :price-ref="priceRef"
        :category-id-ref="categoryIdRef"
        :subcategory-id-ref="subcategoryIdRef"
        @change-record="changeHandlerRecordValue"
      />
    </v-card-text>
    <UpdateRecordSave
      :btn-text="BTN_TEXT[0]"
      :disable-formula="!price || 0 >= price"
      @saved-record="clickHandlerAddBtn"
    />
  </v-card>
</template>
