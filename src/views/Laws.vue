<template>
  <div class="min-h-screen bg-white text-gray-900 flex flex-col">
    <section class="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-primaryDark via-primary to-gray-50 text-white">
      <h2 class="text-5xl font-extrabold mb-4">Pravni propisi i zakoni</h2>
      <p class="text-xl max-w-3xl">
        Pregledajte dostupne zakone i propise brzo i jednostavno.
      </p>
    </section>

    <section class="py-16 px-4 md:px-8 lg:px-20 bg-gray-50 flex-grow">
      <div class="max-w-4xl mx-auto mb-10">
        <input
            v-model="searchTerm"
            type="text"
            placeholder="Pretraži zakone..."
            class="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div v-if="loading" class="text-center text-lg text-gray-600">Učitavanje zakona...</div>
      <div v-else-if="errorMessage" class="text-center text-red-500">{{ errorMessage }}</div>

      <div v-else class="max-w-4xl mx-auto space-y-6">
        <div
            v-for="(law, index) in filteredLaws"
            :key="index"
            class="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition"
        >
          <button
              @click="togglePdf(index)"
              class="text-primary text-xl font-semibold hover:underline text-left"
          >
            {{ law.title }}
          </button>

          <div v-if="openedPdfIndex === index" class="mt-6">
            <iframe
                :src="law.url"
                class="w-full rounded border"
                style="height: 1000px;"
                frameborder="0"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const laws = ref([])
const loading = ref(true)
const errorMessage = ref('')
const searchTerm = ref('')
const openedPdfIndex = ref(null)

const fetchLaws = async () => {
  try {
    const response = await axios.get('/laws')
    laws.value = response.data.laws
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Došlo je do greške prilikom dohvaćanja zakona.'
  } finally {
    loading.value = false
  }
}

const filteredLaws = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return laws.value.filter(law =>
      law.title.toLowerCase().includes(term)
  )
})

const togglePdf = (index) => {
  openedPdfIndex.value = openedPdfIndex.value === index ? null : index
}

onMounted(() => {
  fetchLaws()

  console.log('🟡 Echo is:', window.Echo)

  if (window.Echo) {
    console.log('🟢 Subscribing to laws channel...')

    window.Echo.channel('laws')
      .listen('.laws.updated', (e) => {
        console.log('✅ .laws.updated triggered:', e)
        fetchLaws()
      })
      .listen('LawsUpdated', (e) => {
        console.log('✅ LawsUpdated triggered:', e)
        fetchLaws()
      })
      .listen('*', (e) => {
        console.log('📦 Catch-all event:', e)
      })
  } else {
    console.warn('❌ Echo is not available.')
  }
})
</script>

<style scoped>
</style>
