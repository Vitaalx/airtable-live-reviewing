<script setup lang="ts">
import { reactive } from 'vue';
import bcrypt from 'bcryptjs';
import { z, ZodIssue } from 'zod';
import AirtableBase from '../../../providers/airtable';

const loginSchema = z.object({
  email: z.string().email({ message: "L'adresse mail est invalide." }),
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
    setTimeout(() => {
      formErrors.splice(0, formErrors.length);
    }, 5000);
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
    <div class="flex flex-col items-center">
        <label for="email">Email</label>
        <input v-model="user.email" type="email" id="email" />
        <label for="password">Password</label>
        <input v-model="user.password" type="password" id="password" />
        <button @click="login">Login</button>
        <div v-if="formErrors.length > 0">
            <ul>
                <li v-for="error in formErrors" :key="error.message">{{ error.message }}</li>
            </ul>
        </div>
    </div>
</template>