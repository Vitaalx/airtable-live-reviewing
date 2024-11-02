<script setup lang="ts">
import { reactive } from 'vue';
import bcrypt from 'bcryptjs';
import AirtableBase from '../../../providers/airtable';
import { z, ZodIssue } from 'zod';

const registrationSchema = z.object({
  lastName: z.string().min(3, { message: "Le nom de famille doit contenir au minimum 3 caratères." }),
  firstName: z.string().min(3 , { message: "Le prénom doit contenir au minimum 3 caratères." }),
  email: z.string().email({ message: "L'adresse mail est invalide." }),  
  password: z.string().min(8, { message: "Le mot de passe doit contenir au minimum 8 caratères." })
});

type UserRegisterDto = z.infer<typeof registrationSchema>;

const user = reactive<UserRegisterDto>({
  lastName: "",
  firstName: "",
  email: "",
  password: ""
})

const formErrors = reactive<ZodIssue[]>([]);

async function checkUserExistByMail(email: UserRegisterDto["email"]): Promise<boolean> {
  try {
    const records = await AirtableBase("Users").select({
      filterByFormula: `{Email} = '${email}'`
    }).firstPage();

    if (records.length > 0) {
      console.log("User email already exists");
      return true;
    }
  } catch (err) {
    console.error(err);
  }
  return false;
}

async function register() {
  const validationResult = registrationSchema.safeParse(user);

  if (!validationResult.success) {
    formErrors.push(...validationResult.error.issues);
    setTimeout(() => {
      formErrors.splice(0, formErrors.length);
    }, 5000);
    return;
  }

  const userExist = await checkUserExistByMail(user.email);

  if (userExist) {
    return;
  }

  createUser(user);
}

  async function createUser(user: UserRegisterDto) {
    try {
      const { lastName, firstName, email, password } = user;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, salt);

      AirtableBase("Users").create(
        {
          "Lastname": lastName,
          "Firstname": firstName,
          "Email": email,
          "Password": hashedPassword,
          "Role": "Student"
        }, function(err) {
            if (err) {
              console.error(err);
              return;
            }
          }
      );
    } catch (err) {
      console.error(err);
    }
  }
</script>
<template>
    <div class="flex flex-col items-center">
      <input v-model="user.lastName" type="text" placeholder="Lastname" required/>
      <input v-model="user.firstName" type="text" placeholder="Firstname" required/>
      <input v-model="user.email" type="email" placeholder="Email" required/>
      <input v-model="user.password" type="password" placeholder="Password" required/>
      <button @click="register">Register</button>
      <ul>
        <li class="text-sm text-red-500" v-for="error of formErrors">{{ error.message }}</li>
      </ul>
    </div>
</template>