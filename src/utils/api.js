import axios from "axios";
import { storeToRefs } from "pinia";

import { useAuthStore } from "src/stores";

const authStore = useAuthStore();

const { authData } = storeToRefs(authStore);

const baseURL = new URL("", authData.value.routerUrl).href;
const Authorization = authData.value.authToken;

export const api = axios.create({
    baseURL,
    headers: {
        Authorization,
        "Cache-Control": "no-cache"
    }
});
