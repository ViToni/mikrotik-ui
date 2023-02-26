import { defineStore } from "pinia";

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: loadUser()
    }),
    actions: {
        async login(baseUrl, username, password) {
            const routerUrl = new URL("/", baseUrl).href;
            const authToken = "Basic " + window.btoa(username + ":" + password);

            return authenticate(routerUrl, authToken)
                .then(() => {
                    // create valid user with data just verfied
                    const user = { routerUrl, username, authToken };

                    // update internal state with valid user
                    this.user = user;

                    // store user in local storage to keep user logged in between page refreshes
                    storeUser(user);

                    return true;
                });
        },
        async logout() {
            // keep username and routerUrl for convenience on next login
            // just delete authorization
            delete this.user?.authToken;
            storeUser(this.user);
        },
        hasAuth() {
            return isNotNilOrWhitespace(this.user?.authToken);
        }
    }
});

// =============================================================================
// Internal methods
// =============================================================================

async function authenticate(routerUrl, authToken) {
    // "/rest/system/identity" is the most simple secured page, just the name of the router
    const securedUrl = new URL("/rest/system/identity", routerUrl).href;
    return fetch(securedUrl, {
        method: "GET",
        headers: {
            Authorization: authToken,
            // required otherwise stale pages / credentials might get cached
            "Cache-Control": "no-cache"
        }
    })
        .then(response => {
            if (response.ok) {
                return true;
            }

            return Promise.reject(response.statusText);
        });
}

// =============================================================================

const userKey = "user";

function storeUser(user) {
    localStorage.setItem(userKey, JSON.stringify(user));
}

function loadUser() {
    try {
        return JSON.parse(localStorage.getItem(userKey));
    } catch (e) {
        return null;
    }
}

// =============================================================================

const isNotNilOrWhitespace = input => (input?.trim().length || 0) > 0;

// =============================================================================
