import { RouteRecordRaw } from "vue-router";

export default (): RouteRecordRaw[] => [
    {
        path: "/register",
        component: () => import("./pages/RegisterPage.vue"),
    },
    {
        path: "/login",
        component: () => import("./pages/LoginPage.vue"),
    }
];