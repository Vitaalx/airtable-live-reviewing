import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { SelfUser } from "@/types/user";

const KEY_USER_LOCAL_STORAGE = "user";
export const KEY_ACCESS_TOKEN_LOCAL_STORAGE = "access-token";

export const useUserStore = defineStore(
    "user", 
    {
        state: () => ({
            user: ref<null | SelfUser>(JSON.parse(localStorage.getItem(KEY_USER_LOCAL_STORAGE) || "null")),
            accessToken: ref<null | string>(localStorage.getItem(KEY_ACCESS_TOKEN_LOCAL_STORAGE)),
            isAuthenticated: ref<boolean>(!!localStorage.getItem(KEY_ACCESS_TOKEN_LOCAL_STORAGE)),
        }),
        actions: {
            setUser(user: SelfUser) {
                this.user = user;
                localStorage.setItem(KEY_USER_LOCAL_STORAGE, JSON.stringify(user));
            },
            updateUser() {
                const userString = localStorage.getItem(KEY_USER_LOCAL_STORAGE);
                const storedUser = userString ? JSON.parse(userString) : null;
                if (storedUser?.email != this.user?.email) {
                    this.user.email = storedUser?.email;
                }
                this.isAuthenticated = !!localStorage.getItem(KEY_ACCESS_TOKEN_LOCAL_STORAGE);
            },
            logoutUser() {
                this.user = null;
                localStorage.removeItem(KEY_USER_LOCAL_STORAGE);
                this.setAccessToken(null);
            },
            setAccessToken(newAccessToken: string | null) {
                if (newAccessToken) {
                    localStorage.setItem(
                        KEY_ACCESS_TOKEN_LOCAL_STORAGE,
                        this.accessToken = newAccessToken
                    );
                }
                else {
                    this.accessToken = null;
                    localStorage.removeItem(KEY_ACCESS_TOKEN_LOCAL_STORAGE);
                }
            }
        },
    }
);