import { defineStore } from "pinia";

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        // initialize state from local storage to enable user to keep settings
        user: loadUser(),
        authData: loadAuthData()
    }),
    actions: {
        async login(baseUrl, username, password, darkMode) {
            const routerUrl = new URL("/", baseUrl).href;
            const basicAuth = window.btoa(username + ":" + password);

            return authenticate(routerUrl, basicAuth)
                .then(() => {
                    // create valid user with data just verfied
                    const user = { routerUrl, username, darkMode };

                    // update internal state with valid user
                    this.user = user;

                    // store user data in local storage to keep settings between page refreshes
                    storeUser(user);

                    const authData = { routerUrl, basicAuth };
                    this.authData = authData;

                    // store auth data in session storage to keep user logged only per window / tab
                    storeAuthData(authData);

                    return true;
                });
        },
        async logout() {
            if (this.authData?.routerUrl) {
                // invalidate eventually cached basic auth
                authenticate(this.authData.routerUrl, "")
                    .catch(() => { /* exception expected due to intentionally "wrong" authdata */ });
            }
            // keep username and routerUrl for convenience on next login
            // just remove the autentication
            this.authData = null;
            removeAuthData();
        },
        hasAuth() {
            return isNotNilOrWhitespace(this.authData?.basicAuth);
        },
        saveDarkMode(darkMode) {
            this.user = { ...this.user, darkMode };
            storeUser(this.user);
        }
    }
});

// internal methods

async function authenticate(routerUrl, basicAuth) {
    // "/rest/system/identity" is the most simple secured page, just the name of the router
    const securedUrl = new URL("/rest/system/identity", routerUrl).href;
    const response = await fetch(securedUrl, {
        method: "GET",
        headers: {
            Authorization: "Basic " + basicAuth,
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

// =============================================================================

const authDataKey = "authData";

function storeAuthData(authData) {
    sessionStorage.setItem(authDataKey, JSON.stringify(authData));
}

function loadAuthData() {
    return JSON.parse(sessionStorage.getItem(authDataKey));
}

function removeAuthData() {
    sessionStorage.removeItem(authDataKey);
}

const isNotNilOrWhitespace = input => (input?.trim()?.length || 0) > 0;
