<template>
  <SearchTable
    ref="searchTableRef"
    title="Services"
    :rows="services"
    :columns="columns"
    :visible-columns="visibleColumns"
    :pagination="pagination"
    :hide-pagination="hidePagination"
    row-key=".id"
    :fetch-data="fetchData"
  >
    <!-- override how regular rows are created-->
    <template #body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <template v-if="col.name == 'disabled'">
            <InvertedToggle
              :model-value="col.value"
              @update:model-value="onChange({ disabled: $event }, props.key)"
            />
          </template>
          <!-- break up array values into badges -->
          <span v-else-if="Array.isArray(col.value)">
            <!-- each badge gets an individual class added based on content -->
            <q-badge
              v-for="entry in col.value" :key="entry"
              class="q-ma-xs" :class="`${col.name + '-' + entry}`"
            >{{ entry }}</q-badge></span>
          <!-- non-array values -->
          <span v-else>
            {{ col.value }}
          </span>
        </q-td>
      </q-tr>
    </template>
  </SearchTable>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "src/stores";

import { InvertedToggle, SearchTable } from "components/common";

const dataPath = "/rest/ip/service";

const searchTableRef = ref(null);

const pagination = ref({
    rowsPerPage: 0, // always show all services
    sortBy: "name",
    descending: false
});
const hidePagination = ref(true);

const services = ref([]);
// const services = ref([
//     {
//         ".id": "*1",
//         address: "",
//         disabled: "false",
//         invalid: "false",
//         name: "ftp",
//         port: "21"
//     },
//     {
//         ".id": "*2",
//         address: "",
//         disabled: "false",
//         invalid: "false",
//         name: "www",
//         port: "80",
//         vrf: "main"
//     },
//     {
//         ".id": "*6",
//         address: "",
//         certificate: "mikrotik_ssl.crt_0",
//         disabled: "false",
//         invalid: "false",
//         name: "www-ssl",
//         port: "443",
//         "tls-version": "any",
//         vrf: "main"
//     }
// ]);

const columns = [
    { name: "disabled", field: "disabled", required: true, align: "left", style: "width: .5em" },
    { name: "name", field: "name", label: "Name", required: true, align: "left", style: "width: .3em" },
    { name: "port", field: "port", label: "Port", required: true, align: "right" },
    { name: "address", field: "address", label: "Available from", align: "left", required: true },
    { name: "vrf", field: "vrf", label: "VRF", required: true, align: "left" },
    { name: "certificate", field: "certificate", label: "Certificate", required: true, align: "left" },
    { name: "tls-version", field: "tls-verion", label: "TLS version", required: true }
];

const visibleColumns = ref(["time", "message", "topics"]);

// =============================================================================

const authStore = useAuthStore();

async function fetchData() {
    return authStore.endPoint.get(dataPath)
        .then(response => response.data)
        .then(preprocessData)
        .then(jsonObject => { services.value = jsonObject; });
}

// =============================================================================

function preprocessData(jsonObject) {
    jsonObject.forEach((entry, index) => {
        entry.index = index;
        stringToArray(entry, "address");
    });

    return jsonObject;
}

function stringToArray(entry, name) {
    if (entry[name]?.length > 0) {
        const values = entry[name].split(",");

        entry[name] = values;
    } else {
        entry[name] = [];
    }
}

// =============================================================================

function onChange(data, id) {
    authStore.endPoint.patch(dataPath + "/" + id, data)
        .then(() => searchTableRef.value.refreshData())
        .catch(searchTableRef.value.onError);
}

// =============================================================================
</script>
