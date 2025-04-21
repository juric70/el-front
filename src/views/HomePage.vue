<template>
  <div class="h-full flex flex-col bg-gradient-to-b from-primaryDark via-primary to-primaryLight p-4">
    <div v-if="docLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      <div>
        <button class="bg-primary hover:bg-primaryDark text-white font-bold py-2 px-4 rounded" @click="toggleInstructions">
          {{ showInstructions ? 'Sakrij' : 'Upute' }}
        </button>
        <div v-if="showInstructions" class="mt-2 p-4 border-primaryLight border-2 w-full md:w-auto rounded shadow">
          <h2 class="text-sm font-semibold mb-2 text-white">Kako koristiti chat za pravni dokument</h2>
          <ul class="list-disc ml-5 text-xs text-white">
            <li><strong>Vrsta dokumenta</strong> (npr. tužba, ugovor, punomoć...)</li>
            <li><strong>Podaci o strankama</strong> (npr. ime i prezime tužitelja, tuženika...)</li>
            <li><strong>Činjenični opis</strong> (što se dogodilo, gdje, kada...)</li>
            <li><strong>Pravni temelj</strong> (ako znate pravnu osnovu, možete je navesti)</li>
            <li><strong>Zahtjev</strong> (što želite postići ovim dokumentom)</li>
          </ul>
          <p class="mt-2 text-xs text-white">Primjer: Želim sastaviti kupoprodajni ugovor. Prodavatelj je Ivan Horvat, kupac je Marko Perić. Predmet prodaje je automobil BMW X5, 2018. godište, registracija ST‑123‑AB. Cijena je 20 000 EUR, plaćanje u dvije rate.</p>
        </div>
      </div>

      <div class="flex justify-end items-center gap-2 text-primaryDark">
        <select id="conversation-select" class="p-2 rounded w-full max-w-[50%]" v-model="selectedConversationId" @change="onSelectConversation">
          <option value="">Odaberite razgovor</option>
          <option v-for="c in conversationsList" :key="c.id" :value="c.id">{{ c.topic.length>50?c.topic.slice(0,50)+'...':c.topic }}</option>
        </select>
        <button class="bg-primary hover:bg-primaryDark text-white py-2 px-4 rounded" @click="isOpened=true">+</button>
      </div>
    </div>

    <div class="flex gap-2 mb-4">
      <button class="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded flex items-center gap-2"
              :disabled="!selectedConversationId||docLoading" @click="generateWord">
        <span v-if="docLoading&&docType==='word'" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        📄 Preuzmi Word
      </button>
      <button class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center gap-2"
              :disabled="!selectedConversationId||docLoading" @click="generatePdf">
        <span v-if="docLoading&&docType==='pdf'" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        📄 Preuzmi PDF
      </button>
    </div>

    <div v-if="!showChat" class="flex-1 flex flex-col items-center justify-center text-center">
      <h1 class="text-4xl font-bold mb-6">Dobrodošao u TopLaw!</h1>
      <div class="relative w-full max-w-lg mb-8">
        <input type="text" v-model="userMessage" class="px-4 py-3 border rounded-lg shadow-md text-gray-700 focus:outline-none w-full pr-12"
               placeholder="Molim te napiši mi kako ti mogu pomoći?" @keyup.enter="startChat" />
        <button class="absolute inset-y-0 right-2 flex items-center justify-center p-3" @click="startChat">
          <svg class="w-6 h-6 text-primaryDark" viewBox="0 0 24 24"><path :d="mdiSendIcon" fill="currentColor" /></svg>
        </button>
      </div>
    </div>

    <div v-else class="h-full flex flex-col w-3/4 m-auto">
      <div class="flex-grow overflow-y-auto my-2 flex flex-col-reverse gap-2">
        <div v-for="(msg,index) in messages" :key="index"
             :class="msg.role==='user'?'self-end bg-primaryLight p-2 rounded max-w-3/4':'self-start bg-white p-2 rounded w-3/4'">
          <span>{{ msg.displayText }}</span>
          <div v-if="msg.role==='assistant'&&isLoading&&msg.displayText===''" class="typing-indicator ml-2">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
        </div>
      </div>

      <div class="flex mt-2">
        <input class="flex-1 border p-2 rounded mr-2" v-model="typedMessage" placeholder="Upiši poruku..." @keyup.enter="sendMsg" />
        <button class="bg-primary text-white px-4 py-2 rounded" @click="sendMsg">Pošalji</button>
      </div>
    </div>

    <new-conversation-dialog :is-open="isOpened" @save="createNewConversation" @cancel="isOpened=false" />
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

const showChat=ref(false)
const userMessage=ref('')
const typedMessage=ref('')
const messages=ref([])
const selectedConversationId=ref('')
const conversationsList=ref([])
const isLoading=ref(false)
const showInstructions=ref(false)
const isOpened=ref(false)

const documentError=ref('')
const docLoading=ref(false)
const docType=ref('')

const toggleInstructions=()=>showInstructions.value=!showInstructions.value

onMounted(async()=>{await fetchConversations();AOS.init({duration:1000})})

async function fetchConversations(){try{const r=await axios.get('/api/conversations');conversationsList.value=r.data}catch{}}

async function onSelectConversation(){
  if(!selectedConversationId.value){showChat.value=false;return}
  await loadConversation(selectedConversationId.value);showChat.value=true
}

async function loadConversation(id){
  try{
    messages.value=[]
    const r=await axios.get(`/api/conversations/${id}/history`)
    messages.value=r.data.map(m=>({role:m.role,fullText:m.message,displayText:m.message})).reverse()
  }catch{}
}

async function createNewConversation(topic){
  if(!topic)return
  try{
    const r=await axios.post('/api/conversations',{topic})
    conversationsList.value.push({id:r.data.conversation_id,topic})
    selectedConversationId.value=r.data.conversation_id
    messages.value=[];showChat.value=true;isOpened.value=false
  }catch{}
}

async function startChat(){
  if(!userMessage.value.trim())return
  const current=userMessage.value
  userMessage.value=''
  try{
    const c=await axios.post('/api/conversations',{topic:current})
    selectedConversationId.value=c.data.conversation_id
    conversationsList.value.push({id:c.data.conversation_id,topic:current})
    messages.value.unshift({role:'user',fullText:current,displayText:current})
    const ai={role:'assistant',fullText:'',displayText:''};messages.value.unshift(ai);isLoading.value=true
    const a=await axios.post(`/api/conversations/${selectedConversationId.value}/ask`,{query:current})
    isLoading.value=false;ai.displayText=a.data.answer;showChat.value=true
  }catch{isLoading.value=false}
}

async function sendMsg(){
  if(!typedMessage.value.trim()||!selectedConversationId.value)return
  const current=typedMessage.value
  typedMessage.value=''
  messages.value.unshift({role:'user',fullText:current,displayText:current})
  const ai={role:'assistant',fullText:'',displayText:''};messages.value.unshift(ai);isLoading.value=true
  try{
    const a=await axios.post(`/api/conversations/${selectedConversationId.value}/ask`,{query:current})
    isLoading.value=false;ai.fullText=a.data.answer;ai.displayText=a.data.answer
  }catch{isLoading.value=false}
}

function resetDocState(t) {
  documentError.value = '';
  docType.value = t;
  docLoading.value = true
}

const generateWord = async () => {
  if (!selectedConversationId.value) {
    documentError.value = 'Odaberite razgovor.';
    return
  }
  resetDocState('word')
  try {
    const {data} = await axios.get(`/api/conversations/${selectedConversationId.value}/generate-word`)
    if (!data.file_url?.startsWith('http')) throw new Error()
    const a = document.createElement('a');
    a.href = data.file_url;
    a.download = `Legal_Document_${selectedConversationId.value}.docx`
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)
  } catch {
    documentError.value = 'Greška pri generiranju Word dokumenta.'
  } finally {
    docLoading.value = false
  }
}

const generatePdf = async () => {
  if (!selectedConversationId.value) {
    documentError.value = 'Odaberite razgovor.';
    return
  }
  resetDocState('pdf')
  try {
    const {data} = await axios.get(`/api/conversations/${selectedConversationId.value}/generate-signed-pdf`)
    if (!data.file_url?.startsWith('http')) throw new Error()
    window.open(data.file_url, '_blank')
  } catch {
    documentError.value = 'Greška pri generiranju PDF‑a.'
  } finally {
    docLoading.value = false
  }
}
</script>

<style scoped>
.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px
}

.typing-indicator .dot {
  width: 6px;
  height: 6px;
  background-color: currentColor;
  border-radius: 50%;
  animation: blink 1.4s infinite both
}

.typing-indicator .dot:nth-child(1) {
  animation-delay: 0s
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: .2s
}

.typing-indicator .dot:nth-child(3) {
  animation-delay: .4s
}

@keyframes blink {
  0% {
    opacity: .2
  }
  20% {
    opacity: 1
  }
  100% {
    opacity: .2
  }
}
</style>
