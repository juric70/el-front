<template>
  <div class="max-w-xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Moj potpis</h1>
    <div v-if="loading" class="text-center">Učitavanje...</div>
    <div v-else>
      <textarea
          v-model="signature"
          rows="5"
          class="w-full p-2 border rounded mb-4"
          placeholder="Unesite svoj potpis..."
      ></textarea>
      <button
          @click="saveSignature"
          class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Spremi potpis
      </button>
      <div v-if="message" class="mt-4 text-green-600">{{ message }}</div>
      <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const signature = ref('')
const loading = ref(true)
const message = ref('')
const error = ref('')

const fetchSignature = async () => {
  try {
    const response = await axios.get('/api/signature')
    signature.value = response.data.signature
  } catch (err) {
    if (err.response && err.response.status === 404) {
      // Ako potpis ne postoji, postavi prazan string
      signature.value = ''
    } else {
      error.value = 'Došlo je do greške prilikom učitavanja potpisa.'
    }
  } finally {
    loading.value = false
  }
}

const saveSignature = async () => {
  try {
    error.value = ''
    message.value = ''
    const response = await axios.post('/api/signature', { signature: signature.value })
    message.value = response.data.message
  } catch (err) {
    error.value =
        err.response?.data?.message ||
        'Došlo je do greške prilikom spremanja potpisa.'
  }
}

onMounted(() => {
  fetchSignature()
})
</script>

<style scoped>
/* Dodajte dodatne stilove po želji */
</style>
