<!--
    Component wrapper for q-table with title and search box above the table
-->
<template>
  <q-table
    :filter="filter"
    v-bind="{...$props, ...$attrs}"
    color="primary"
    dense
  >
    <template #top="props">
      <div class="q-table__title">{{ title }}</div>
      <q-space />
      <q-input
        v-model="filter"
        dense
        placeholder="Search"
        debounce="300"
      >
        <template #append>
          <q-icon name="search" dense />
        </template>
      </q-input>

      <!-- Fullscreen -->
      <q-btn
        flat round dense
        class="q-ml-sm"
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="props.toggleFullscreen"
      />
    </template>

    <!-- insert slots passed to component -->
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </q-table>
</template>

<script>
import { QTable } from "quasar";

export default {
    components: QTable,
    inheritAttrs: true,
    props: {
        title: {
            type: String,
            default: ""
        }
    }
};
</script>

<script setup>
import { ref } from "vue";

// connects table and search box
const filter = ref("");
</script>

<style scoped>
.q-input {
    width: 25em;
    min-width: 20em;
}
</style>
