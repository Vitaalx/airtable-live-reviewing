import { RouteRecordRaw } from "vue-router";

export default (): RouteRecordRaw[] => [
    {
        path: "/module-choice",
        component: () => import("./pages/ModuleChoicePage.vue"),
    },
    {
        path: "/unanswered-questions/:moduleName",
        component: () => import("./pages/QuestionsPage.vue"),
    }
];