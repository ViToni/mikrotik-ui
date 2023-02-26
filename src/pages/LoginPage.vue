<template>
  <div class="fullscreen text-center q-pa-md flex flex-center">
    <q-card bordered class="q-pa-lg">
      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input
            v-model="routerUrl" dense label="Router address"
            placeholder="https://<router-address>:port"
          >
            <template #before>
              <q-icon name="lan" />
            </template>
          </q-input>
          <q-input v-model="username" dense label="User" placeholder="admin">
            <template #before>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input v-model="password" dense :type="passwordFieldType" label="Password">
            <template #before>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-icon :name="visibilityIcon" class="cursor-pointer" @click="switchVisibility" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <div v-if="apiError" class="alert alert-danger mt-3 mb-0">{{ apiError }}</div>
      <q-card-actions class="q-px-md">
        <q-btn unelevated color="primary" size="med" class="full-width" label="Login" @click="submit" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useAuthStore } from "src/stores";

const router = useRouter();
const authStore = useAuthStore();

const routerUrl = ref("");
const username = ref("");
const password = ref("");

const passwordFieldType = ref("password");
const visibility = ref(false);
const visibilityIcon = ref("visibility");

const apiError = ref(null);

onMounted(() => {
    const { user: authUser } = storeToRefs(authStore);

    routerUrl.value = authUser.value?.routerUrl ?? "https://";
    username.value = authUser.value?.username ?? "admin";
});

function switchVisibility() {
    visibility.value = !visibility.value;
    passwordFieldType.value = visibility.value ? "text" : "password";
    visibilityIcon.value = visibility.value ? "visibility_off" : "visibility";
}

async function submit() {
    return await authStore.login(routerUrl.value, username.value, password.value)
        .then(() => { router.redirectAfterLogin(); })
        .catch(error => { apiError.value = error.message ?? error; });
}
</script>

<style scoped>
  .q-card {
    width: 360px;
  }
</style>
