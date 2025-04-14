<template>
  <div class="h-full flex flex-col bg-gradient-to-b from-primaryDark via-primary to-primaryLight  p-4">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      <div>
        <button
            class="bg-primary hover:bg-primaryDark text-white font-bold py-2 px-4 rounded"
            @click="toggleInstructions"
        >
          {{ showInstructions ? 'Sakrij' : 'Upute' }}
        </button>
        <div
            v-if="showInstructions"
            class="mt-2 p-4 border-primaryLight border-2 w-full md:w-auto rounded shadow"
        >
          <h2 class="text-sm font-semibold mb-2 text-white">Kako koristiti chat za pravni dokument?</h2>
          <ul class="list-disc ml-5 text-xs text-white">
            <li><strong>Vrsta dokumenta</strong> (npr. tužba, ugovor, punomoć...)</li>
            <li><strong>Podaci o strankama</strong> (npr. ime i prezime tužitelja, tuženika, kupca, prodavatelja...)</li>
            <li><strong>Činjenični opis</strong> (što se dogodilo, gdje, kada...)</li>
            <li><strong>Pravni temelj</strong> (ako znate pravnu osnovu, možete je navesti)</li>
            <li><strong>Zahtjev</strong> (što želite postići ovim dokumentom?)</li>
          </ul>
          <p class="mt-2 text-xs text-white">
            <strong>Primjer:</strong> "Želim sastaviti kupoprodajni ugovor. Prodavatelj je Ivan Horvat,
            kupac je Marko Perić. Predmet prodaje je automobil BMW X5, 2018. godište, registracija
            ST-123-AB. Cijena je 20.000 EUR, a plaćanje se vrši u dvije rate."
          </p>
        </div>
      </div>
      <div class="flex justify-end items-center gap-2 text-primaryDark">
        <select
            id="conversation-select"
            class="p-2 rounded w-full max-w-[50%]"
            v-model="selectedConversationId"
            @change="onSelectConversation"
        >
          <option value="">-- Odaberite razgovor --</option>
          <option
              v-for="conv in conversationsList"
              :key="conv.id"
              :value="conv.id"
          >
            {{ conv.topic.length > 50 ? (conv.topic.slice(0, 50) + '...') : conv.topic }}
          </option>
        </select>
        <button
            class="bg-primary hover:bg-primaryDark text-white py-2 px-4 rounded"
            @click="isOpened = true"
        >
          +
        </button>
      </div>
    </div>
    <div class="flex gap-2 mb-4">
      <button
          class="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
          @click="generateWord"
      >
        📄 Preuzmi Word
      </button>
      <button
          class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          @click="generatePdf"
      >
        📄 Preuzmi PDF
      </button>
    </div>
    <div v-if="!showChat" class="flex-1 flex flex-col items-center justify-center text-center">
      <h1 class="text-4xl font-bold mb-6">Dobrodošao u TopLaw!</h1>
      <div class="relative w-full max-w-lg mb-8">
        <input
            type="text"
            v-model="userMessage"
            class="px-4 py-3 border rounded-lg shadow-md text-gray-700 focus:outline-none w-full pr-12"
            placeholder="Molim te napiši mi kako ti mogu pomoći?"
            @keyup.enter="startChat"
        />
        <button
            class="absolute inset-y-0 right-2 flex items-center justify-center p-3"
            @click="startChat"
        >
          <svg class="w-6 h-6 text-primaryDark" viewBox="0 0 24 24">
            <path :d="mdiSendIcon" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
    <div v-else class="h-full flex flex-col w-3/4 m-auto">
      <div class="flex-grow overflow-y-auto my-2 flex flex-col-reverse gap-2">
        <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="[
            msg.role === 'user'
              ? 'self-end bg-primaryLight p-2 rounded max-w-3/4'
              : 'self-start bg-white p-2 rounded w-3/4'
          ]"
        >
          <span>{{ msg.displayText }}</span>
          <div
              v-if="msg.role === 'assistant' && isLoading && msg.displayText === ''"
              class="typing-indicator ml-2"
          >
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
      <div class="flex mt-2">
        <input
            class="flex-1 border p-2 rounded mr-2"
            v-model="typedMessage"
            placeholder="Upiši poruku..."
            @keyup.enter="sendMsg"
        />
        <button class="bg-primary text-white px-4 py-2 rounded" @click="sendMsg">
          Pošalji
        </button>
      </div>
    </div>
    <new-conversation-dialog
        :is-open="isOpened"
        @save="createNewConversation"
        @cancel="isOpened = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { mdiSend } from '@mdi/js'
import NewConversationDialog from '../components/NewConversationDialog.vue'

const mdiSendIcon = mdiSend
const showChat = ref(false)
const userMessage = ref('')
const typedMessage = ref('')
const messages = ref([])
const selectedConversationId = ref('')
const conversationsList = ref([])
const isLoading = ref(false)
const showInstructions = ref(false)
const isOpened = ref(false)

const toggleInstructions = () => {
  showInstructions.value = !showInstructions.value
}

onMounted(async () => {
  await fetchConversations()
  AOS.init({ duration: 1000 })
})

async function fetchConversations() {
  try {
    const response = await axios.get('/api/conversations')
    conversationsList.value = response.data
  } catch (error) {
    console.error('Greška kod dohvaćanja razgovora:', error)
  }
}

async function onSelectConversation() {
  if (!selectedConversationId.value) {
    showChat.value = false
    return
  }
  await loadConversation(selectedConversationId.value)
  showChat.value = true
}

async function loadConversation(convId) {
  try {
    messages.value = []
    const res = await axios.get(`/api/conversations/${convId}/history`)
    messages.value = res.data.map(msg => ({
      role: msg.role,
      fullText: msg.message,
      displayText: msg.message
    })).reverse()
  } catch (error) {
    console.error('Greška kod učitavanja povijesti razgovora:', error)
  }
}

async function createNewConversation(topic) {
  if (!topic) return
  try {
    const response = await axios.post('/api/conversations', { topic })
    if (response.data && response.data.conversation_id) {
      conversationsList.value.push({
        id: response.data.conversation_id,
        topic
      })
      selectedConversationId.value = response.data.conversation_id
      messages.value = []
      showChat.value = true
      isOpened.value = false
    }
  } catch (error) {
    console.error('Greška kod kreiranja novog razgovora:', error)
  }
}

async function startChat() {
  if (!userMessage.value.trim()) return
  try {
    const convResponse = await axios.post('/api/conversations', { topic: userMessage.value })
    selectedConversationId.value = convResponse.data.conversation_id
    conversationsList.value.push({
      id: convResponse.data.conversation_id,
      topic: userMessage.value
    })
    messages.value.unshift({
      role: 'user',
      fullText: userMessage.value,
      displayText: userMessage.value
    })
    const aiMessage = { role: 'assistant', fullText: '', displayText: '' }
    messages.value.unshift(aiMessage)
    isLoading.value = true
    const askResponse = await axios.post(`/api/conversations/${selectedConversationId.value}/ask`, { query: userMessage.value })
    isLoading.value = false
    aiMessage.fullText = askResponse.data.answer
    aiMessage.displayText = askResponse.data.answer
    showChat.value = true
    userMessage.value = ''
  } catch (error) {
    console.error('Error starting chat:', error)
    isLoading.value = false
  }
}

async function sendMsg() {
  if (!typedMessage.value.trim() || !selectedConversationId.value) return
  messages.value.unshift({
    role: 'user',
    fullText: typedMessage.value,
    displayText: typedMessage.value
  })
  const aiMessage = { role: 'assistant', fullText: '', displayText: '' }
  messages.value.unshift(aiMessage)
  isLoading.value = true
  try {
    const askResponse = await axios.post(`/api/conversations/${selectedConversationId.value}/ask`, { query: typedMessage.value })
    isLoading.value = false
    aiMessage.fullText = askResponse.data.answer
    aiMessage.displayText = askResponse.data.answer
    typedMessage.value = ''
  } catch (error) {
    console.error('Error sending message:', error)
    isLoading.value = false
  }
}

async function generateWord() {
  if (!selectedConversationId.value) {
    alert('Molimo odaberite razgovor.')
    return
  }
  try {
    const response = await axios.get(`/api/conversations/${selectedConversationId.value}/generate-word`, { responseType: 'blob' })
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'dokument.docx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Greška pri preuzimanju Worda:', error)
  }
}

async function generatePdf() {
  if (!selectedConversationId.value) {
    alert('Molimo odaberite razgovor.')
    return
  }
  try {
    const response = await axios.get(`/api/conversations/${selectedConversationId.value}/generate-signed-pdf`, { responseType: 'blob' })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'dokument.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Greška pri preuzimanju PDF-a:', error)
  }
}
</script>

<style scoped>
.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.typing-indicator .dot {
  width: 6px;
  height: 6px;
  background-color: currentColor;
  border-radius: 50%;
  animation: blink 1.4s infinite both;
}
.typing-indicator .dot:nth-child(1) {
  animation-delay: 0s;
}
.typing-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes blink {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>
