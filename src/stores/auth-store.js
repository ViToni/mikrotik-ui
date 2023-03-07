import { defineStore } from "pinia";

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: loadUser()
    }),
    actions: {
        async login(baseUrl, username, password, darkMode) {
            const routerUrl = new URL("/", baseUrl).href;
            const authdata = window.btoa(username + ":" + password);

            return authenticate(routerUrl, authdata)
                .then(() => {
                    // create valid user with data just verfied
                    const user = { routerUrl, username, authdata, darkMode };

                    // update internal state with valid user
                    this.user = user;

                    // store user in local storage to keep user logged in between page refreshes
                    storeUser(user);

                    return true;
                });
        },
        async logout() {
            // keep username and routerUrl for convenience on next login
            // just remove the autentication
            this.user.authdata = null;
            storeUser(this.user);
            if (this.user.routerUrl) {
                // invalidate eventually cached basic auth
                authenticate(this.user.routerUrl, "")
                    .catch(() => { /* exception expected due to intentionally "wrong" authdata */ });
            }
        },
        hasAuth() {
            return isNotNilOrWhitespace(this.user.authdata);
        },
        saveDarkMode(darkMode) {
            this.user = { ...this.user, darkMode };
            storeUser(this.user);
        }
    }
});

// internal methods

async function authenticate(routerUrl, authdata) {
    // "/rest/system/identity" is the most simple secured page, just the name of the router
    const securedUrl = new URL("/rest/system/identity", routerUrl).href;
    const response = await fetch(securedUrl, {
        method: "GET",
        headers: {
            Authorization: "Basic " + authdata,
            // required otherwise stale credentials might get cached
            "Cache-Control": "no-cache"
        }
    });

    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return true;
}

const userKey = "user";

function storeUser(user) {
    localStorage.setItem(userKey, JSON.stringify(user));
}

function loadUser() {
    return JSON.parse(localStorage.getItem(userKey));
}

const isNotNilOrWhitespace = input => (input?.trim()?.length || 0) > 0;
