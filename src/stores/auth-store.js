import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        // initialize state from local storage to enable user to keep settings
        user: loadUser(),
        authData: loadAuthData()
    }),
    getters: {
        darkMode: (state) => state.user?.darkMode,
        endPoint: (state) => createEndPoint(state.authData)
    },
    actions: {
        async login(baseUrl, username, authToken, darkMode) {
            const routerUrl = new URL("/", baseUrl).href;

            return authenticate(routerUrl, authToken)
                .then(() => {
                    // create valid user with data just verfied
                    const user = { routerUrl, username, darkMode };

                    // update internal state with valid user
                    this.user = user;

                    // store user data in local storage to keep settings between page refreshes
                    storeUser(user);

                    const authData = { routerUrl, authToken };
                    this.authData = authData;

                    // store auth data in session storage to keep user logged only per window / tab
                    storeAuthData(authData);

                    return true;
                });
        },
        async logout() {
            // keep username and routerUrl for convenience on next login (in user)
            // just delete authorization
            this.authData = null;
            removeAuthData();
        },
        hasAuth() {
            return isNotNilOrWhitespace(this.authData?.authToken);
        },
        saveDarkMode(darkMode) {
            this.user = { ...this.user, darkMode };
            storeUser(this.user);
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
    const item = localStorage.getItem(userKey);

    return parseJSON(item);
}

// =============================================================================

const authDataKey = "authData";

function storeAuthData(authData) {
    sessionStorage.setItem(authDataKey, JSON.stringify(authData));
}

function loadAuthData() {
    const item = sessionStorage.getItem(authDataKey);

    return parseJSON(item);
}

function removeAuthData() {
    sessionStorage.removeItem(authDataKey);
}

// =============================================================================

const isNotNilOrWhitespace = input => (input?.trim().length || 0) > 0;

// =============================================================================

function parseJSON(item) {
    try {
        return JSON.parse(item);
    } catch (e) {
        return null;
    }
}

// =============================================================================

function createEndPoint(authData) {
    const baseURL = authData.routerUrl;
    const Authorization = authData.authToken;

    return axios.create({
        baseURL,
        headers: {
            Authorization,
            "Cache-Control": "no-cache"
        }
    });
}

// =============================================================================
