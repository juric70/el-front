<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
    <!-- Hero zaglavlje -->
    <section class="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-primaryDark via-primary to-gray-50 text-white">
      <h2 class="text-5xl font-extrabold mb-4">Moj profil</h2>
      <p class="text-xl max-w-2xl">Upravljajte svojim korisničkim računom i podacima.</p>
    </section>

    <!-- Glavni sadržaj -->
    <section class="flex justify-center py-16 px-4">
      <div class="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <div v-if="loading" class="text-center text-gray-600">Učitavanje profila...</div>

        <div v-else>
          <!-- PRIKAZ PODATAKA -->
          <div v-if="!isEditing" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-600">Ime i prezime</label>
              <p class="text-lg font-semibold text-gray-900">{{ form.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600">Email</label>
              <p class="text-lg font-semibold text-gray-900">{{ form.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600">Uloga</label>
              <p class="text-lg font-semibold text-gray-900 capitalize">{{ form.role }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600">Datum registracije</label>
              <p class="text-lg font-semibold text-gray-900">{{ new Date(form.created_at).toLocaleString() }}</p>
            </div>
            <div class="flex justify-end mt-8">
              <button
                  @click="isEditing = true"
                  class="px-6 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primaryDark transition"
              >
                Uredi profil
              </button>
            </div>
          </div>

          <!-- UREĐIVANJE -->
          <form v-else @submit.prevent="updateProfile" class="space-y-5">
            <div>
              <label for="name" class="block text-sm font-medium">Ime i prezime</label>
              <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  class="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-primary"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium">Email</label>
              <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  class="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-primary"
              />
            </div>

            <div class="flex flex-wrap gap-4 mt-6 justify-between">
              <button
                  type="submit"
                  class="bg-primary hover:bg-primaryDark text-white px-6 py-2 rounded-full"
                  :disabled="updating"
              >
                Spremi promjene
              </button>

              <button
                  type="button"
                  @click="isEditing = false"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full"
              >
                Odustani
              </button>

            </div>
          </form>

          <!-- Poruke -->
          <div v-if="message" class="text-green-600 mt-6 text-center">{{ message }}</div>
          <div v-if="error" class="text-red-600 mt-6 text-center">{{ error }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(true)
const updating = ref(false)
const isEditing = ref(false)

const form = ref({
  name: '',
  email: '',
  role: '',
  created_at: ''
})

const message = ref('')
const error = ref('')

const fetchProfile = async () => {
  try {
    const { data } = await axios.get('/api/profile')
    form.value.name = data.user.name
    form.value.email = data.user.email
    form.value.role = data.user.role
    form.value.created_at = data.user.created_at
  } catch (err) {
    error.value = 'Greška pri dohvaćanju profila.'
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  updating.value = true
  message.value = ''
  error.value = ''
  try {
    await axios.patch('/api/profile', {
      name: form.value.name,
      email: form.value.email
    })
    message.value = 'Profil je uspješno ažuriran.'
    isEditing.value = false
  } catch (err) {
    error.value = 'Greška pri spremanju promjena.'
  } finally {
    updating.value = false
  }
}


onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
</style>
