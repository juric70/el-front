<template>
  <!-- Prikazujemo side menu samo ako je isOpen === true -->
  <div
      v-if="isOpen"
      class="fixed top-0 left-0 w-64 h-screen bg-primaryDark  shadow-lg z-50 overflow-y-auto"
  >
    <!-- Zaglavlje side menija -->
    <div class="p-4 border-b border-primary flex justify-between items-center bg-gradient-to-r  from-primary to-primaryDark" >
      <div>
        <img src="/white-icon.svg" width="100" alt="White Icon" class="pt-6 pb-6">
      </div>
      <button
          @click="closeMenu"
          class="px-2 py-1 rounded">X</button>
    </div>


    <ul>
      <li class="p-3 border-b border-b-[0.3px] border-primary hover:bg-primary cursor-pointer" onclick="window.location.href='/'" >Početna</li>
      <li class="p-3 border-b border-b-[0.3px] border-primary hover:bg-primary cursor-pointer" onclick="window.location.href='/login'">Login</li>

    </ul>
    <div class="font-bold p-4 border-b border-b-[0.3px] border-primary ">
      <h2>Povijest razgovora</h2>
    </div>

    
    <ul>
          <li
          v-for="chat in chats"
          :key="chat.id"
          @click="goToChat(chat.id)"
          class="p-3 border-b border-primary hover:bg-primary cursor-pointer">
        {{ chat.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'

// Definicija prop-a: isOpen kontrolira prikaz menija
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emitiramo "close" kad kliknemo X ili na chat
const emit = defineEmits(['close'])

const router = useRouter()

// Fiktivni razgovori
const chats = ref([
  {id: 1, title: 'Razgovor 1'},
  {id: 2, title: 'Razgovor 2'},
  {id: 3, title: 'Razgovor 3'}
])

// Klik na razgovor -> navigacija + zatvaranje menija
function goToChat(id) {
  router.push(`/chat/${id}`)
  emit('close')
}

// Klik na X -> zatvaranje
function closeMenu() {
  emit('close')
}
</script>
