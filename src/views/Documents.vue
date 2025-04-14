<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <!-- Naslov stranice -->
    <h1 class="text-4xl font-bold text-center mb-6">Rad s dokumentima i potpisom</h1>

    <!-- Sekcija 1: Spremanje potpisa -->
    <section class="border rounded-lg p-4 shadow-sm">
      <h2 class="text-2xl font-semibold mb-4">Spremi potpis za dokumente</h2>
      <div class="border p-2 mb-4">
        <canvas ref="signaturePad" class="w-full" style="height: 200px;"></canvas>
      </div>
      <div class="flex flex-wrap gap-4">
        <button @click="clearSignature" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">
          Očisti
        </button>
        <button
            @click="saveSignature"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            :disabled="!signatureData"
        >
          Spremi potpis
        </button>
      </div>
      <p v-if="signatureMessage" class="mt-2 text-green-600">{{ signatureMessage }}</p>
      <p v-if="signatureError" class="mt-2 text-red-600">{{ signatureError }}</p>
    </section>

    <!-- Sekcija 2: Generiranje dokumenata -->
    <section class="border rounded-lg p-4 shadow-sm">
      <h2 class="text-2xl font-semibold mb-4">Generiraj dokumente</h2>
      <div class="mb-4">
        <label for="conversationId" class="block text-lg mb-1">ID razgovora:</label>
        <input
            type="text"
            v-model="conversationId"
            id="conversationId"
            class="border rounded w-full p-2"
            placeholder="Unesite ID razgovora"
        />
      </div>
      <div class="flex flex-wrap gap-4 mb-4">
        <button
            @click="generateWord"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            :disabled="!conversationId || docLoading"
        >
          Generiraj Word
          <span v-if="docLoading && docType === 'word'" class="ml-2 text-sm">Učitavanje...</span>
        </button>
        <button
            @click="generateSignedPdf"
            class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            :disabled="!conversationId || docLoading"
        >
          Generiraj potpisani PDF
          <span v-if="docLoading && docType === 'pdf'" class="ml-2 text-sm">Učitavanje...</span>
        </button>
      </div>
      <p v-if="documentMessage" class="text-green-600">{{ documentMessage }}</p>
      <p v-if="documentError" class="text-red-600">{{ documentError }}</p>
      <div v-if="fileUrl" class="mt-2">
        <a :href="fileUrl" target="_blank" class="text-blue-500 underline">Pregledaj generirani dokument</a>
      </div>
    </section>

    <!-- Sekcija 3: Provjera autentičnosti dokumenta -->
    <section class="border rounded-lg p-4 shadow-sm">
      <h2 class="text-2xl font-semibold mb-4">Provjera autentičnosti dokumenta</h2>
      <button
          @click="verifyDocument"
          class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          :disabled="!conversationId || verifyLoading"
      >
        Provjeri dokument
        <span v-if="verifyLoading" class="ml-2 text-sm">Učitavanje...</span>
      </button>
      <p v-if="verifyMessage" class="mt-2 text-green-600">{{ verifyMessage }}</p>
      <p v-if="verifyError" class="mt-2 text-red-600">{{ verifyError }}</p>
      <div v-if="verifyUrl" class="mt-2">
        <a :href="verifyUrl" target="_blank" class="text-blue-500 underline">Pogledaj detalje dokumenta</a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Sekcija: Potpis
const signaturePad = ref(null)
const signatureData = ref('')
const signatureMessage = ref('')
const signatureError = ref('')

// Sekcija: Dokumenti
const conversationId = ref('')
const documentMessage = ref('')
const documentError = ref('')
const fileUrl = ref('')
const docLoading = ref(false)
const docType = ref('') // 'word' ili 'pdf'

// Sekcija: Provjera dokumenta
const verifyMessage = ref('')
const verifyError = ref('')
const verifyUrl = ref('')
const verifyLoading = ref(false)

// Postavljanje canvasa za potpis
let canvas, ctx, drawing = false

onMounted(() => {
  canvas = signaturePad.value
  if (canvas) {
    ctx = canvas.getContext('2d')
    // Postavi dimenzije canvasa
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Dodaj event listenere za crtanje (miš i touch)
    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('mouseout', stopDrawing)
    canvas.addEventListener('touchstart', startDrawing)
    canvas.addEventListener('touchmove', draw)
    canvas.addEventListener('touchend', stopDrawing)
  }
})

const getMousePos = (e) => {
  const rect = canvas.getBoundingClientRect()
  let clientX, clientY
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    clientX = e.clientX
    clientY = e.clientY
  }
  return { x: clientX - rect.left, y: clientY - rect.top }
}

const startDrawing = (e) => {
  drawing = true
  ctx.beginPath()
  const pos = getMousePos(e)
  ctx.moveTo(pos.x, pos.y)
  e.preventDefault()
}

const draw = (e) => {
  if (!drawing) return
  const pos = getMousePos(e)
  ctx.lineTo(pos.x, pos.y)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.stroke()
  e.preventDefault()
}

const stopDrawing = (e) => {
  if (drawing) {
    drawing = false
    e.preventDefault()
    signatureData.value = canvas.toDataURL('image/png')
  }
}

const clearSignature = () => {
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    signatureData.value = ''
  }
}

const saveSignature = async () => {
  signatureMessage.value = ''
  signatureError.value = ''
  try {
    const response = await axios.post('/api/signature/document', {
      signature: signatureData.value,
    })
    signatureMessage.value = response.data.message
  } catch (err) {
    signatureError.value = err.response?.data?.message || 'Greška prilikom spremanja potpisa.'
  }
}

// Sekcija: Generiranje dokumenata
const generateWord = async () => {
  if (!conversationId.value.trim()) {
    documentError.value = 'Unesite ID razgovora.'
    return
  }
  documentMessage.value = ''
  documentError.value = ''
  fileUrl.value = ''
  docType.value = 'word'
  docLoading.value = true
  try {
    const response = await axios.get(`/api/conversations/${conversationId.value}/generate-word`)
    documentMessage.value = response.data.message
    fileUrl.value = response.data.file_url
  } catch (err) {
    console.log(err.response?.data?.error)
    documentError.value = err.response?.data?.error || 'Greška pri generiranju Word dokumenta.'
  } finally {
    docLoading.value = false
  }
}

const generateSignedPdf = async () => {
  if (!conversationId.value.trim()) {
    documentError.value = 'Unesite ID razgovora.'
    return
  }
  documentMessage.value = ''
  documentError.value = ''
  fileUrl.value = ''
  docType.value = 'pdf'
  docLoading.value = true
  try {
    const response = await axios.get(`/api/conversations/${conversationId.value}/generate-signed-pdf`)
    documentMessage.value = response.data.message
    fileUrl.value = response.data.file_url
  } catch (err) {
    documentError.value = err.response?.data?.error || 'Greška pri generiranju potpisanog PDF-a.'
  } finally {
    docLoading.value = false
  }
}

// Sekcija: Provjera autentičnosti dokumenta
const verifyDocument = async () => {
  if (!conversationId.value.trim()) {
    verifyError.value = 'Unesite ID razgovora.'
    return
  }
  verifyMessage.value = ''
  verifyError.value = ''
  verifyUrl.value = ''
  verifyLoading.value = true
  try {
    const response = await axios.get(`/api/verify-document/${conversationId.value}`)
    verifyMessage.value = response.data.message || 'Dokument je autentikalan.'
    verifyUrl.value = response.data.file_url || ''
  } catch (err) {
    verifyError.value = err.response?.data?.error || 'Greška pri provjeri dokumenta.'
  } finally {
    verifyLoading.value = false
  }
}
</script>

<style scoped>
canvas {
  touch-action: none;
}

/* Opcionalno: dodatni stilovi za sekcije */
section {
  background-color: #ffffff;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
