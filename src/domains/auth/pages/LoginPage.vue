<script setup lang="ts">
import { reactive } from 'vue';
import bcrypt from 'bcryptjs';
import { z, ZodIssue } from 'zod';
import AirtableBase from '../../../providers/airtable';

const loginSchema = z.object({
  email: z.string().email({ message: "L'adresse email est invalide." }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au minimum 8 caratères." })
});

type UserLoginDto = z.infer<typeof loginSchema>;

const user = reactive<UserLoginDto>({
  email: "",
  password: ""
});

const formErrors = reactive<ZodIssue[]>([]);

async function login() {
  const validationResult = loginSchema.safeParse(user);

  console.log(user);
  if (!validationResult.success) {
    formErrors.push(...validationResult.error.issues);

    return;
  }

  // select a user by email and hashed password
  // if the user exists, redirect to the dashboard
  // else, display an error message
  const records = await AirtableBase("Users").select({
    filterByFormula: `({Email} = '${user.email}')`
  }).firstPage();

  if (records.length > 0) {
    const record = records[0];
    const hashedPassword = record.get("Password") as string;
    const isPasswordValid = await bcrypt.compare(user.password, hashedPassword);

    if (isPasswordValid) {
      console.log("Logged in successfully");
      // redirect to the dashboard
    } else {
      console.log("Invalid password");
    }
  } else {
    console.log("This email does not match any user");
  }
}

</script>
<template>
    <section class="h-screen-nh flex justify-center items-center container">
      <div class="flex items-center justify-center py-12">
        <div class="mx-auto grid w-96 gap-6 p-6 bg-white rounded-md shadow-md">
          <div class="grid gap-2 text-center">
						<h1 class="text-3xl font-bold">
							Connexion
						</h1>

						<p class="text-balance text-muted-foreground">
							Connectez-vous à votre compte.
						</p>
					</div>
          <div class="flex gap-2 flex-col items-center">
            <div class="w-full">
              <input v-model="user.email" class="w-full p-2 border border-gray-300 rounded-md" type="email" placeholder="Email" required/>
              <span class="text-sm text-red-500" v-if="formErrors.length > 0">{{ formErrors[2].message }}</span>
            </div>
            <div class="w-full">
              <input v-model="user.password" class="w-full p-2 border border-gray-300 rounded-md" type="password" placeholder="Mot de passe" required/>
              <span class="text-sm text-red-500" v-if="formErrors.length > 0">{{ formErrors[3].message }}</span>
            </div>
            <button @click="login" class="w-full p-2 bg-blue-500 text-white rounded-md">S'inscrire</button>
          </div>
        </div>
      </div>
    </section>
</template>