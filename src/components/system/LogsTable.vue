<template>
  <q-table
    title="Logs"
    :loading="loading"
    :rows="logs"
    :columns="columns"
    :visible-columns="visibleColumns"
    :pagination="pagination"
    :rows-per-page-options="rowsPerPageOptions"
    row-key=".id"
    dense
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores";

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
        name: "topics",
        required: true,
        label: "Topics",
        align: "left",
        field: "topics",
        style: "width: 16em"
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
</script>
