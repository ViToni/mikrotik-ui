<template>
  <div />
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores";

const router = useRouter();
const authStore = useAuthStore();

authStore.logout();
router.push("/");
</script>
