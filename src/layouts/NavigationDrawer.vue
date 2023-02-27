<template>
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
</template>

<script setup>
import EssentialLink from "components/EssentialLink.vue";

const essentialLinks = [
];
</script>
