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
// import { date } from "quasar";
import { useAuthStore } from "src/stores";

const authStore = useAuthStore();

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
        /*
        format: val => {
            const timeStamp = date.extractDate(val, "MMM/DD HH:mm:ss", {
                days: [],
                daysShort: [],
                months: [],
                monthsShort: [
                    "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"
                ]
            });
            return date.formatDate(timeStamp, "MM-DD HH:mm:ss");
        }
        */
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

const securedUrl = new URL("/rest/log?.proplist=.id,time,message,topics", authStore.user.routerUrl).href;

onMounted(() => {
    fetch(securedUrl, {
        method: "GET",
        headers: {
            Authorization: "Basic " + authStore.user.authdata
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
