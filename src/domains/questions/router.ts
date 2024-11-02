import { RouteRecordRaw } from "vue-router";

export default (): RouteRecordRaw[] => [
    {
        path: "/questionnaire",
        component: () => import("./pages/QuestionsPage.vue"),
    },
];