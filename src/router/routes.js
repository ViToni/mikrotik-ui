
const routes = [
    {
        path: "/",
        component: () => import("layouts/MainLayout.vue"),
        meta: { requiresAuth: true },
        children: [
            {
                path: "/system/logs",
                component: () => import("components/system/LogsTable.vue")
            },
            {
                path: "/system/services",
                component: () => import("components/system/ServicesTable.vue")
            }
        ]
    },
    {
        name: "Login",
        path: "/login",
        component: () => import("pages/LoginPage.vue")
    },
    {
        name: "Logout",
        path: "/logout",
        component: () => import("pages/LogoutPage.vue")
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue")
    }
];

export default routes;
