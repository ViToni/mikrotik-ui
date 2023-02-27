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
          MikroTik UI
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label>Navigation</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>Logout</q-item-section>
        </q-item>
      </q-list>

      <q-expansion-item
        v-if="0 < essentialLinks.length"
        dense
        expand-separator
        icon="bookmark"
        label="Essential Links"
        default-closed
        class="absolute-bottom"
      >
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-expansion-item>
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

import EssentialLink from "components/EssentialLink.vue";

const drawerOpen = ref(false);
function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value;
}

const essentialLinks = [
];
</script>

<style>
.body--light {
    background: #ccc;
}

.q-drawer {
    background: #f9f9f9;
}
</style>
