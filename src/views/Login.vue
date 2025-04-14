<template>
  <div
      class="h-full bg-gradient-to-b from-primaryDark via-primary to-primaryLight text-gray-800 p-4 flex items-center justify-center"
  >
    <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg" data-aos="fade-up">
      <h2 class="text-2xl font-bold text-center text-primary">Prijava</h2>

      <form @submit.prevent="handleLogin" class="mt-4">
        <div class="mb-4">
          <label class="block text-gray-600">Email</label>
          <input
              v-model="email"
              type="email"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-primary"
              required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-600">Password</label>
          <input
              v-model="password"
              type="password"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-primary"
              required
          />
        </div>

        <div class="mb-4">
          <p class="text-sm text-gray-500">
            Ukoliko niste registrirani
            <router-link to="/register" class="text-primary underline cursor-pointer">
              Registriraj se
            </router-link>
          </p>
        </div>

        <button
            type="submit"
            class="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primaryDark transition"
        >
          Login
        </button>
      </form>


      <p v-if="errorMessage" class="mt-4 text-red-500 text-center">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'


import axios from 'axios'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

onMounted(() => {
  AOS.init()
})

const handleLogin = async () => {
  errorMessage.value = ''

  try {
    const response = await axios.post('/api/login', {
      email: email.value,
      password: password.value
    })

    const { token, user } = response.data

    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    }
    window.location.href = '/'

  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Nešto je pošlo po zlu.'
  }
}
</script>
