<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">Zakoni</h1>
    <div v-if="loading" class="text-center">Učitavanje zakona...</div>
    <div v-else-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
    <ul v-else class="space-y-4">
      <li v-for="(law, index) in laws" :key="index">
        <a :href="law.url" target="_blank" rel="noopener" class="text-blue-600 hover:underline">
          {{ law.title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const laws = ref([])
const loading = ref(true)
const errorMessage = ref('')

const fetchLaws = async () => {
  try {
    const response = await axios.get('/api/laws')
    laws.value = response.data.laws
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Došlo je do greške prilikom dohvaćanja zakona.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLaws()
})
</script>

<style scoped>
</style>
