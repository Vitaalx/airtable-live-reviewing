<script setup lang="ts">
import { reactive } from 'vue';
import bcrypt from 'bcryptjs';
import AirtableBase from '../../../providers/airtable';
import { z, ZodIssue } from 'zod';
import { useRouter } from 'vue-router';

const router = useRouter();

const registrationSchema = z.object({
  lastName: z.string().min(3, { message: "Le nom de famille doit contenir au minimum 3 caratères." }),
  firstName: z.string().min(3 , { message: "Le prénom doit contenir au minimum 3 caratères." }),
  email: z.string().email({ message: "L'adresse email est invalide." }),  
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

    return;
  }

  const userExist = await checkUserExistByMail(user.email);

  if (userExist) {
    return;
  }

  const isCreated = await createUser(user);
  if (isCreated) {
    router.push({ path: "/login" });
  } else {
    console.log("Error while creating user");
  }

}

  async function createUser(user: UserRegisterDto): Promise<boolean> {
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
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
</script>
<template>
    <section class="container flex items-center justify-center h-screen-nh">
      <div class="flex items-center justify-center py-12">
        <div class="grid gap-6 p-6 mx-auto bg-white rounded-md shadow-md w-96">
          <div class="grid gap-2 text-center">
						<h1 class="text-3xl font-bold">
							Inscription
						</h1>

						<p class="text-balance text-muted-foreground">
							Créez un compte pour accéder à la plateforme.
						</p>
					</div>
          
          <div class="flex flex-col items-center gap-2">
            <div class="w-full">
              <input v-model="user.lastName" class="w-full p-2 border border-gray-300 rounded-md" type="text" placeholder="Nom" required/>
              
              <span class="text-sm text-red-500" v-if="formErrors.length > 0">{{ formErrors[0].message }}</span>
            </div>
            
            <div class="w-full">
              <input v-model="user.firstName" class="w-full p-2 border border-gray-300 rounded-md" type="text" placeholder="Prénom" required/>
              
              <span class="text-sm text-red-500" v-if="formErrors.length > 0">{{ formErrors[1].message }}</span>
            </div>
            
            <div class="w-full">
              <input v-model="user.email" class="w-full p-2 border border-gray-300 rounded-md" type="email" placeholder="Email" required/>
              
              <span class="text-sm text-red-500" v-if="formErrors.length > 0">{{ formErrors[2].message }}</span>
            </div>
            
            <div class="w-full">
              <input v-model="user.password" class="w-full p-2 border border-gray-300 rounded-md" type="password" placeholder="Mot de passe" required/>
              
              <span class="text-sm text-red-500" v-if="formErrors.length > 0">{{ formErrors[3].message }}</span>
            </div>
            
            <button @click="register" class="w-full p-2 text-white bg-blue-500 rounded-md">S'inscrire</button>
          </div>
        </div>
      </div>
    </section>
</template>