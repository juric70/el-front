<template>
  <div class="min-h-screen bg-white text-gray-900 flex flex-col">
    <div v-if="docLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>

    <section class="flex flex-col items-center justify-center text-center py-24 bg-gradient-to-b from-primaryDark via-primary to-gray-50 to-10% text-white">
      <h2 class="text-5xl font-extrabold mb-6">Rad s dokumentima i potpisom</h2>
    </section>

    <section class="py-20 px-8 bg-gray-50 flex-grow">
      <div class="max-w-4xl mx-auto space-y-12">
        <div class="p-8 bg-white border rounded-xl shadow-lg space-y-6">
          <h3 class="text-3xl font-semibold text-primary mb-2">Spremi potpis</h3>
          <div class="border p-2 rounded-md">
            <canvas ref="signaturePad" class="w-full" style="height:200px;" />
          </div>
          <div class="flex flex-wrap gap-4">
            <button @click="clearSignature" class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full">Očisti</button>
            <button @click="saveSignature" class="px-6 py-2 bg-primary hover:bg-primaryDark text-white rounded-full"
                    :disabled="!signatureData">Spremi potpis</button>
          </div>
          <p v-if="signatureMessage" class="text-green-600">{{ signatureMessage }}</p>
          <p v-if="signatureError"   class="text-red-600">{{ signatureError }}</p>
        </div>

        <div class="p-8 bg-white border rounded-xl shadow-lg space-y-6">
          <h3 class="text-3xl font-semibold text-primary mb-2">Generiraj dokument</h3>

          <div>
            <label for="conversationTitle" class="block text-lg mb-1 text-primary">Odaberi razgovor</label>
            <select v-model="selectedConversationTitle" @change="updateConversationId"
                    id="conversationTitle" class="border rounded w-full p-2">
              <option value="">-- Odaberi razgovor --</option>
              <option v-for="c in conversations" :key="c.id" :value="c.id">{{ c.topic }}</option>
            </select>
          </div>

          <div class="flex flex-wrap gap-4">
            <button @click="generateWord"
                    class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center gap-2"
                    :disabled="!conversationId || docLoading">
              <span v-if="docLoading && docType==='word'" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Word
            </button>

            <button @click="generateSignedPdf"
                    class="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center gap-2"
                    :disabled="!conversationId || docLoading">
              <span v-if="docLoading && docType==='pdf'" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              PDF
            </button>
          </div>

          <p v-if="documentMessage" class="text-green-600">{{ documentMessage }}</p>
          <p v-if="documentError"   class="text-red-600">{{ documentError }}</p>

          <div v-if="fileUrl">
            <a :href="fileUrl" target="_blank" class="text-primary underline">Pregledaj zadnje generirani dokument</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const signaturePad = ref(null)
const signatureData = ref('')
const signatureMessage = ref('')
const signatureError = ref('')

const conversations = ref([])
const selectedConversationTitle = ref('')
const conversationId = ref(null)

const documentMessage = ref('')
const documentError = ref('')
const fileUrl = ref('')
const docLoading = ref(false)
const docType = ref('')

const fetchConversations = async () => {
  const { data } = await axios.get('/api/conversations').catch(()=>({data:[]}))
  conversations.value = data.conversations ?? data
}

const updateConversationId = () => {
  conversationId.value = conversations.value.find(c => c.id === +selectedConversationTitle.value)?.id || null
}

const openDocument = () => {
  if (!fileUrl.value) return
  const url = fileUrl.value.includes('?') ? fileUrl.value : `${fileUrl.value}?t=${Date.now()}`
  window.open(url, '_blank')
}

const generateWord = async () => {
  if (!conversationId.value) {
    documentError.value = 'Odaberite razgovor.'
    return
  }
  resetDocState('word')

  try {
    const { data } = await axios.get(
        `/api/conversations/${conversationId.value}/generate-word`
    )

    if (!data.file_url?.startsWith('http')) throw new Error()

       // 👉  umjesto axios.get(file_url) ➜ umjetni klik
       const a = document.createElement('a')
       a.href      = data.file_url
       a.download  = `Legal_Document_${conversationId.value}.docx`
       document.body.appendChild(a)
       a.click()
       document.body.removeChild(a)

    fileUrl.value        = data.file_url
    documentMessage.value = data.message || 'Word dokument je generiran.'
  } catch {
    documentError.value = 'Greška pri generiranju Word dokumenta.'
  } finally {
    docLoading.value = false
  }
}

const generateSignedPdf = async () => {
  if (!conversationId.value) return (documentError.value = 'Odaberite razgovor.')
  resetDocState('pdf')
  try {
    const { data } = await axios.get(`/api/conversations/${conversationId.value}/generate-signed-pdf`)
    if (!data.file_url?.startsWith('http')) throw new Error()
    fileUrl.value = data.file_url
    documentMessage.value = data.message || 'PDF dokument je generiran.'
    window.open(fileUrl.value, '_blank')
  } catch {
    documentError.value = 'Greška pri generiranju PDF‑a.'
  } finally {
    docLoading.value = false
  }
}

function resetDocState(type){
  documentMessage.value=''
  documentError.value=''
  fileUrl.value=''
  docType.value=type
  docLoading.value=true
}

let canvas, ctx, drawing=false
const getMousePos = e=>{
  const r=canvas.getBoundingClientRect()
  const c=e.touches?.[0]??e
  return{ x:c.clientX-r.left,y:c.clientY-r.top }
}
const startDrawing=e=>{drawing=true;ctx.beginPath();const p=getMousePos(e);ctx.moveTo(p.x,p.y);e.preventDefault()}
const draw=e=>{if(!drawing)return;const p=getMousePos(e);ctx.lineTo(p.x,p.y);ctx.strokeStyle='black';ctx.lineWidth=2;ctx.stroke();e.preventDefault()}
const stopDrawing=e=>{if(!drawing)return;drawing=false;e.preventDefault();signatureData.value=canvas.toDataURL('image/png')}
const clearSignature=()=>{if(!ctx)return;ctx.clearRect(0,0,canvas.width,canvas.height);signatureData.value=''}

const saveSignature = async () => {
  signatureMessage.value=''
  signatureError.value=''
  try{
    const { data } = await axios.post('/api/signature/document',{ signature:signatureData.value })
    signatureMessage.value=data.message
  }catch(err){
    signatureError.value=err.response?.data?.message||'Greška prilikom spremanja potpisa.'
  }
}

onMounted(()=> {
  fetchConversations()
  canvas = signaturePad.value
  ctx = canvas.getContext('2d')
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  ;['mousedown', 'touchstart'].forEach(e => canvas.addEventListener(e, startDrawing))
  ;['mousemove', 'touchmove'].forEach(e => canvas.addEventListener(e, draw))
  ;['mouseup', 'mouseout', 'touchend'].forEach(e => canvas.addEventListener(e, stopDrawing))
})
</script>

<style scoped>
canvas {
  touch-action: none
}

button:disabled {
  opacity: .5;
  cursor: not-allowed
}
</style>
