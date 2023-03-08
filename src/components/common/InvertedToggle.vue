<template>
  <q-toggle
    false-value="true"
    true-value="false"
    checked-icon="check"
    color="green"
    unchecked-icon="clear"
    size="xs"
    v-bind="{...$props, ...$attrs}"
  />
</template>

<script setup />
