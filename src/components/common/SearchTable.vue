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
    <template #no-data>
      <div v-if="!loading" class="full-width row flex-center q-gutter-sm">
        <span style="font-size: 1.2em">No data.</span>
      </div>
    </template>
  </q-table>
</template>

<script>
import { inject } from "vue";
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
    setup() {
        const delayedShowLoading = inject("delayedLoading");
        const hideLoading = inject("disableLoading");
        return {
            delayedShowLoading,
            hideLoading
        };
    },
    data() {
        return {
            filter: "",
            loading: true
        };
    },
    mounted() {
        this.refreshData();
    },
    methods: {
        refreshData() {
            this.loading = true;
            const timeoutId = this.delayedShowLoading();
            this.fetchData()
                .catch(Notifier.onError)
                .finally(() => {
                    this.hideLoading(timeoutId);
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
