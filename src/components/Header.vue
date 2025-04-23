<script setup>
import { ref } from 'vue'
import { useAuthStore } from './../stores/auth'
import SideMenu from './SideMenu.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isMenuOpen = ref(false)

function openMenu() {
  isMenuOpen.value = true
}

function closeMenu() {
  isMenuOpen.value = false
}

const logout = async () => {
  try {
    await axios.post('/logout')
    authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error("Greška pri odjavi:", error)
  }
}
</script>

<template>
  <header class="bg-gradient-to-r from-primary to-primaryDark shadow-md text-white">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-3">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div>
          <img src="/white-icon.svg" width="80" alt="White Icon" />
        </div>
        <!-- Navigacija -->
        <div class="flex items-center">
          <nav class="flex items-center space-x-4">
            <template v-if="authStore.isLoggedIn">
              <!-- Na malim ekranima: prikazujemo hamburger i logout gumb -->
              <div class="flex md:hidden items-center space-x-4">
                <button @click="openMenu">
                  <svg class="w-6 h-6 cursor-pointer" fill="white" viewBox="0 0 24 24">
                    <path d="M3 6h18M3 12h18m-18 6h18" stroke="white" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </button>
                <button @click="logout" class="px-2 py-1 text-sm bg-red-600 rounded">
                  Odjava
                </button>
              </div>
              <!-- Na srednjim i većim ekranima: hamburger i tekstualni gumb za odjavu -->
              <div class="hidden md:flex items-center space-x-4">
                <svg class="w-6 h-6 cursor-pointer" fill="white" viewBox="0 0 24 24" @click="openMenu">
                  <path d="M3 6h18M3 12h18m-18 6h18" stroke="white" stroke-width="2" stroke-linecap="round" />
                </svg>
                <button @click="logout" class="px-4 py-1 bg-red-600 rounded">
                  Odjavi se
                </button>
              </div>
            </template>
            <template v-else>
              <router-link to="/login" class="hover:underline">
                Login
              </router-link>
            </template>
          </nav>
        </div>
      </div>
    </div>

    <SideMenu v-if="authStore.isLoggedIn" :isOpen="isMenuOpen" @close="closeMenu" />
  </header>
</template>
