<template>
  <q-list>
    <q-item>
      <q-item-section>
        <q-item-label>Navigation</q-item-label>
      </q-item-section>
    </q-item>

    <q-btn
      color="grey"
      class="absolute-top-right q-mr-xs q-mt-xs"
      flat
      round
      :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
      @click="toggleDarkMode()"
    />

    <q-expansion-item
      :content-inset-level="1"
      dense
      expand-separator
      icon="router"
      label="System"
      default-opened
    >
      <q-item to="/system/logs" dense>
        <q-item-section avatar>
          <q-icon name="view_list" />
        </q-item-section>
        <q-item-section>Logs</q-item-section>
      </q-item>
    </q-expansion-item>

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
</template>

<script setup>
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores";

import { EssentialLink } from "components/common";

const authStore = useAuthStore();
const $q = useQuasar();

function toggleDarkMode() {
    $q.dark.toggle();

    const darkMode = $q.dark.isActive;
    authStore.saveDarkMode(darkMode);
}

const essentialLinks = [
    {
        title: "MikroTik-UI",
        caption: "github.com/ViToni/mikrotik-ui",
        icon: "code",
        link: "https://github.com/ViToni/mikrotik-ui"
    },
    {
        title: "MikroTik Forum",
        caption: "forum.mikrotik.com",
        icon: "record_voice_over",
        link: "https://forum.mikrotik.com/"
    },
    {
        title: "MikroTik Wiki",
        caption: "wiki.mikrotik.com/",
        icon: "school",
        link: "https://wiki.mikrotik.com/"
    },
    {
        title: "MikroTik Wiki (new)",
        caption: "help.mikrotik.com/docs",
        icon: "school",
        link: "https://help.mikrotik.com/docs"
    }
];
</script>
