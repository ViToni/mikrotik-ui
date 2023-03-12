<!--
    Component wrapper for q-table with title and search box above the table
-->
<template>
  <q-table
    :filter="filter"
    :loading="loading"
    v-bind="{...$props, ...$attrs}"
    color="primary"
    dense
  >
    <template #top="props">
      <div class="q-table__title">{{ title }}</div>
      <!-- Refresh -->
      <q-btn
        class="q-ml-sm"
        flat round dense
        icon="refresh"
        size="sm"
        @click="refreshData"
      />

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
    <template #loading>
      <q-inner-loading showing color="primary" />
    </template>
  </q-table>
</template>

<script>
import { ref } from "vue";
import { Notifier } from "src/utils";
import { QTable } from "quasar";

export default {
    components: QTable,
    inheritAttrs: true,
    props: {
        title: {
            type: String,
            default: ""
        },
        fetchData: {
            type: Function,
            default: undefined,
            desc: "Fetch data for table"
        }
    },
    data() {
        // connects table and search box
        const filter = ref("");

        // indicator for table data loading is done
        const loading = ref(true);

        return {
            filter,
            loading
        };
    },
    mounted() {
        this.refreshData();
    },
    methods: {
        refreshData() {
            this.loading = true;
            this.fetchData()
                .catch(Notifier.onError)
                .finally(() => {
                    this.loading = false;
                });
        },
        onError: Notifier.onError
    }
};
</script>

<style scoped>
.q-input {
    width: 25em;
    min-width: 20em;
}
</style>
