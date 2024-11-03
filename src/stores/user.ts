import { defineStore } from "pinia";
import { SelfUser } from "../types/user";
import { ref } from "vue";

const PREFIX_KEY = "user";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: ref<SelfUser | null>(JSON.parse(localStorage.getItem(PREFIX_KEY) || "null")),
        isAuthenticated: ref<boolean>(false),
    }),
    actions: {
        setUser(user: SelfUser) {
            this.user = user;
            this.isAuthenticated = true;
            localStorage.setItem(PREFIX_KEY, JSON.stringify(user));
        },
        updateUser() {
            const storedUser: SelfUser | null = JSON.parse(localStorage.getItem(PREFIX_KEY) || "");
            if (storedUser?.email != this.user.email) {
                this.user.email = storedUser?.email;
            }
        },
        logoutUser() {
            this.user = null;
            this.isAuthenticated = false;
            localStorage.removeItem(PREFIX_KEY);
        }
    },
});