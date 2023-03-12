<template>
  <q-layout view="hHh Lpr fFf">
    <q-header :class="$q.dark.isActive ? '' : 'inset-shadow-down'">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleDrawer"
        />
        <q-toolbar-title>
          <q-avatar size="sm" class="q-mb-xs">
            <img src="/img/mtv2/android-chrome-512x512.png">
          </q-avatar>
          MikroTik UI
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      show-if-above
      bordered
    >
      <NavigationDrawer />
    </q-drawer>

    <q-page-container>
      <q-page class="flex-center">
        <div class="column q-ma-xl">
          <router-view />
          <q-inner-loading
            :showing="isLoading"
            color="primary"
            style="transform: translateY(calc(-20%)) !important;"
          >
            <q-spinner-dots color="primary" size="3em" />
            <div style="font-size: 1.5em">Please wait...</div>
          </q-inner-loading>
        </div>
      </q-page>
    </q-page-container>

    <q-footer reveal class="row justify-end">
      <div class="q-mr-sm q-ml-sm">Quasar v{{ $q.version }}</div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted, provide, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores";

import NavigationDrawer from "./NavigationDrawer.vue";

const drawerOpen = ref(false);
function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value;
}

const isLoading = ref(false);

function delayedLoading() {
    return setTimeout(async () => {
        isLoading.value = true;
    }, 400);
}

function disableLoading(timeoutId) {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    isLoading.value = false;
}

provide("delayedLoading", delayedLoading);
provide("disableLoading", disableLoading);

const $q = useQuasar();
const authStore = useAuthStore();

watch(() => $q.dark.isActive, authStore.saveDarkMode);

onMounted(() => {
    // default to non-darkMode when unknown
    const darkMode = authStore.darkMode ?? false;
    $q.dark.set(darkMode);
});
</script>

<style lang="scss">
.body--light {
    background: $grey-4
}

.body--dark {
    background: $grey-9;
    color: $blue-grey-1;
}

.q-header, .q-footer {
    background: #0c355d;;
}

.q-drawer, .q-item {
    background: $grey-3;
}

.q-drawer--dark, .q-item--dark {
    background: $grey-10;
}
</style>
