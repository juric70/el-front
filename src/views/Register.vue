<template>
  <div class="h-full bg-gradient-to-b from-primaryDark via-primary to-primaryLight text-gray-800 p-4 flex items-center justify-center">
    <div
        class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg"
        data-aos="fade-up"
    >
      <h2 class="text-2xl font-bold text-center text-primaryDark">Registriraj se</h2>
      <form @submit.prevent="handleRegister" class="mt-4">
        <div class="mb-4">
          <label class="block text-gray-600">Ime i prezime</label>
          <input
              v-model="name"
              type="text"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-primaryLight"
              required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-600">Email</label>
          <input
              v-model="email"
              type="email"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-primaryLight"
              required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-600">Lozinka</label>
          <input
              v-model="password"
              type="password"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-primaryLight"
              required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-600">Ponovljena lozinka</label>
          <input
              v-model="confirmPassword"
              type="password"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-primaryLight"
              required
          />
        </div>
        <div class="mb-4">
          <p class="text-sm text-gray-500">Ukoliko već imate račun
            <router-link to="/login" class="text-primary underline cursor-pointer">
              Prijavi se!
            </router-link>
          </p>
        </div>
        <button
            type="submit"
            class="w-full px-4 py-2 text-white bg-primaryDark rounded-md hover:bg-primary transition"
        >
          Register
        </button>
      </form>
      <p v-if="errorMessage" class="mt-4 text-red-500 text-center">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="mt-4 text-green-500 text-center">
        {{ successMessage }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

import axios from '../axios.js';

export default {
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const errorMessage = ref('');
    const successMessage = ref('');

    onMounted(() => {
      AOS.init();
    });

    const handleRegister = async () => {
      if (password.value !== confirmPassword.value) {
        errorMessage.value = "Lozinke se ne podudaraju!";
        successMessage.value = "";
        return;
      }

      try {
        const response = await axios.post('api/register', {
          name: name.value,
          email: email.value,
          password: password.value,
          password_confirmation: confirmPassword.value
        });

        successMessage.value = response.data.message || "Registracija uspješna!";
        errorMessage.value = "";

        // Spremi token u localStorage (ako postoji)
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        // (Neobavezno) Spremi user-a u localStorage ili globalni store
        // localStorage.setItem('user', JSON.stringify(response.data.user));

        // npr. odma preusmjeri na Dashboard ili login
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } catch (error) {
        errorMessage.value = error.response?.data?.error
            || "Došlo je do greške prilikom registracije.";
        successMessage.value = "";
      }
    };

    return {
      name,
      email,
      password,
      confirmPassword,
      errorMessage,
      successMessage,
      handleRegister
    };
  }
};
</script>
