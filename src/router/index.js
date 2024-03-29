import { route } from "quasar/wrappers";
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from "vue-router";

import { useAuthStore } from "src/stores";

import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
    const authStore = useAuthStore();

    const redirectPathKey = "redirectPath";

    const startPage = "/";
    const loginPage = "/login";

    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : (process.env.VUE_ROUTER_MODE === "history" ? createWebHistory : createWebHashHistory);

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,

        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(process.env.VUE_ROUTER_BASE)
    });

    Router.beforeEach(async (to) => {
        if (authStore.hasAuth) {
            // redirect away from login page if already logged in
            if (loginPage === to.path) {
                return startPage;
            }
        } else {
            // redirect to login page if not logged in and trying to access a restricted page
            const authRequired = to.matched.some(record => record.meta.requiresAuth);
            if (authRequired) {
                sessionStorage.setItem(redirectPathKey, to.fullPath);
                return loginPage;
            }
        }
    });

    Router.redirectAfterLogin = function () {
        const storedRedirectPath = sessionStorage.getItem(redirectPathKey);
        if (storedRedirectPath) {
            sessionStorage.removeItem(redirectPathKey);
        }
        const redirectPath = storedRedirectPath ?? startPage;
        this.push(redirectPath);
    };

    return Router;
});
