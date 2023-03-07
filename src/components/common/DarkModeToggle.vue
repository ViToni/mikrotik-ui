<template>
  <q-btn
    color="grey"
    flat
    round
    :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
    v-bind="{...$props, ...$attrs}"
    @click="$q.dark.toggle()"
  />
</template>

<script setup>
import { useQuasar } from "quasar";
const $q = useQuasar();

</script>
