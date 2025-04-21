<template>
  <div
      v-if="isOpen"
      class="fixed top-0 left-0 w-64 h-screen bg-primaryDark  shadow-lg z-50 overflow-y-auto"
  >
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
      <li class="p-3 border-b border-b-[0.3px] border-primary hover:bg-primary cursor-pointer" onclick="window.location.href='/chat'">Razgovori</li>
      <li class="p-3 border-b border-b-[0.3px] border-primary hover:bg-primary cursor-pointer" onclick="window.location.href='/laws'">Zakoni</li>
<!--      <li class="p-3 border-b border-b-[0.3px] border-primary hover:bg-primary cursor-pointer" onclick="window.location.href='/signature'">Potpis</li>-->
      <li class="p-3 border-b border-b-[0.3px] border-primary hover:bg-primary cursor-pointer" onclick="window.location.href='/documents'">Dokumenti</li>
      <li class="p-3 border-b border-b-[0.3px] border-primary hover:bg-primary cursor-pointer" onclick="window.location.href='/profile'">Profil</li>
      <li class="p-3 border-b border-b-[0.3px] border-primary hover:bg-primary cursor-pointer" onclick="window.location.href='/aboutus'">O nama</li>

    </ul>


    
<!--    <ul>-->
<!--          <li-->
<!--          v-for="chat in chats"-->
<!--          :key="chat.id"-->
<!--          @click="goToChat(chat.id)"-->
<!--          class="p-3 border-b border-primary hover:bg-primary cursor-pointer">-->
<!--        {{ chat.title }}-->
<!--      </li>-->
<!--    </ul>-->
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const router = useRouter()

const chats = ref([
  {id: 1, title: 'Razgovor 1'},
  {id: 2, title: 'Razgovor 2'},
  {id: 3, title: 'Razgovor 3'}
])

function goToChat(id) {
  router.push(`/chat/${id}`)
  emit('close')
}

function closeMenu() {
  emit('close')
}
</script>
