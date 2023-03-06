<template>
  <SearchTable
    title="Logs"
    :loading="loading"
    :rows="logs"
    :columns="columns"
    :visible-columns="visibleColumns"
    :pagination="pagination"
    :rows-per-page-options="rowsPerPageOptions"
    row-key=".id"
  >
    <!-- override how regular rows are created-->
    <template #body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <!-- break up array values into badges -->
          <span v-if="Array.isArray(col.value)">
            <!-- each badge gets an individual class added based on content -->
            <q-badge
              v-for="entry in col.value" :key="entry"
              class="q-ma-xs" :class="`${col.name + '-' + entry}`"
              :rounded="isLogLevel(entry)"
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
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores";

import { SearchTable } from "components/common";

const dataPath = "/rest/log?.proplist=.id,time,message,topics";

const loading = ref(true);

const pagination = ref({
    rowsPerPage: 20,
    sortBy: ".id",
    descending: true
});
const rowsPerPageOptions = ref(
    [20, 50, 100, 200, 500, 0]
);

const logs = ref([]);
// const logs = ref([
//     {
//         ".id": "*C82",
//         message: "user admin logged in via api",
//         time: "feb/23 13:28:18",
//         topics: "system,info,account"
//     }
// ]);

const columns = [
    {
        name: ".id",
        field: ".id",
        sortable: true,
        sort: (a, b, rowA, rowB) => idCompareTo(a, b)
    },
    {
        name: "time",
        required: true,
        label: "Time",
        align: "left",
        field: "time",
        style: "width: 8em"
    },
    {
        name: "message",
        required: true,
        label: "Message",
        align: "left",
        field: "message",
        style: "width: 70em"
    },
    {
        name: "level",
        required: true,
        label: "Level",
        align: "left",
        field: "levels",
        style: "width: 8em"
    },
    {
        name: "system",
        required: true,
        label: "System",
        align: "left",
        field: "systems",
        style: "width: 8em"
    }
];

const visibleColumns = ref(["time", "message", "topics"]);

// =============================================================================

const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

const securedUrl = new URL(dataPath, authUser.value.routerUrl).href;

onMounted(() => {
    fetch(securedUrl, {
        method: "GET",
        headers: {
            Authorization: authUser.value.authToken,
            "Cache-Control": "no-cache"
        }
    })
        .then(response => response.json())
        .then(splitTopics)
        .then(jsonObject => { logs.value = jsonObject; })
        .catch(error => { console.log("Error: " + error); })
        .finally(() => {
            loading.value = false;
        });
});

// =============================================================================

function idCompareTo(a, b) {
    const valA = idToNumber(a);
    const valB = idToNumber(b);

    return valA - valB;
}

function idToNumber(id) {
    return parseInt(id.substring(1), 16);
}

// =============================================================================

function splitTopics(jsonObject) {
    jsonObject.forEach((entry) => {
        if (entry.topics?.length > 0) {
            const topics = entry.topics.split(",");

            entry.levels = getLogLevels(topics).sort(logLevelCompareTo);
            entry.systems = getSystems(topics);
        } else {
            entry.levels = [];
            entry.systems = [];
        }
        delete entry.topics;
    });

    return jsonObject;
}

// =============================================================================

const logLevels = {
    info: 4,
    warning: 2,
    error: 1,
    critical: 0
};

function getLogLevels(entries) {
    return entries.filter(isLogLevel);
}

function getSystems(entries) {
    return entries.filter(isLogLevel.not);
}

function isLogLevel(entry) {
    return (entry in logLevels);
}
isLogLevel.not = (...args) => !isLogLevel(...args);

function logLevelCompareTo(a, b) {
    const isLogA = logLevels[a] ?? Number.MAX_VALUE;
    const isLogB = logLevels[b] ?? Number.MAX_VALUE;

    return (isLogA - isLogB);
}

// =============================================================================
</script>

<style scoped>
.level-info {
    background-color: green;
}

.level-warning {
    background-color: yellow;
    color: darkslategrey
}

.level-error {
    background-color: orange;
    color: darkslategrey
}

.level-critical {
    background-color: red;
}

.system-dhcp {
    background-color: lightblue;
    color: darkslategrey
}

.system-system {
    background-color: salmon
}
</style>
