<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
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
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="row justify-end">
      <div class="q-mr-sm q-ml-sm">Quasar v{{ $q.version }}</div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

import NavigationDrawer from "./NavigationDrawer.vue";

const drawerOpen = ref(false);
function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value;
}
</script>

<style>
.body--light {
    background: #ccc;
}

.q-drawer {
    background: #f9f9f9;
}
</style>
