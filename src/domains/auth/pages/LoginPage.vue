<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import bcrypt from 'bcryptjs';
import { ZodIssue } from 'zod';

import AirtableBase from '@/providers/airtable';
import { useUserStore } from '@/stores/user';
import { loginSchema, UserLoginDto } from '@/types/user';
import { generateToken } from '@/utils/token';

const router = useRouter();

const user = reactive<UserLoginDto>({
  email: "",
  password: ""
});

const userStore = useUserStore();

const zodFormErrors = reactive<ZodIssue[]>([]);
const loginFormErrors = ref("");


async function login() {
  const validationResult = loginSchema.safeParse(user);

  if (!validationResult.success) {
    zodFormErrors.push(...validationResult.error.issues);
    return;
  }

  const records = await AirtableBase("Users").select({
    filterByFormula: `({Email} = '${user.email}')`
  }).firstPage();

  if (records.length > 0) {
    const record = records[0];
    const userId = record.id as string;
    const userEmail = record.get("Email") as string;
    const hashedPassword = record.get("Password") as string;
    
    if (!hashedPassword) {
      loginFormErrors.value = "Le mot de passe est incorrect";
      return;
    }
    const isPasswordValid = await bcrypt.compare(user.password, hashedPassword);

    if (isPasswordValid) {
      const token = await generateToken(
        { email: user.email }
      );

      userStore.setAccessToken(token);
      userStore.setUser(
        {
          id: userId,
          email: userEmail 
        }
      );

      router.push({ path: "/module-choice" });
    } else {
      loginFormErrors.value = "Le mot de passe est incorrect";
    }
  } else {
    loginFormErrors.value = "L'utilisateur n'existe pas";
  }
}
</script>

<template>
    <section class="container flex items-center justify-center h-screen-nh">
      <div class="flex items-center justify-center py-12">
        <div class="grid gap-6 p-6 mx-auto bg-white rounded-md shadow-md w-96">
          <div class="grid gap-2 text-center">
						<h1 class="text-3xl font-bold">
							Connexion
						</h1>

						<p class="text-balance text-muted-foreground">
							Connectez-vous à votre compte.
						</p>
					</div>

          <div class="flex flex-col items-center gap-2">
            <div class="w-full">
              <input v-model="user.email" class="w-full p-2 border border-gray-300 rounded-md" type="email" placeholder="Email" required/>
              
              <span class="text-sm text-red-500" v-if="zodFormErrors.length > 0">{{ zodFormErrors[0].message }}</span>
            </div>

            <div class="w-full">
              <input v-model="user.password" class="w-full p-2 border border-gray-300 rounded-md" type="password" placeholder="Mot de passe" required/>
              
              <span class="text-sm text-red-500" v-if="zodFormErrors.length > 0">{{ zodFormErrors[1].message }}</span>
            </div>
            
            <button @click="login" class="w-full p-2 text-white bg-blue-500 rounded-md">Se connecter</button>
            <span class="text-sm text-red-500" v-if="loginFormErrors.length > 0">{{ loginFormErrors }}</span>
          </div>
        </div>
      </div>
    </section>
</template>