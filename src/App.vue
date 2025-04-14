<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="h-screen flex flex-col">
    <Header></Header>

    <main class="flex-grow">
      <RouterView />
    </main>

    <footer class="bg-gradient-to-r  from-primary to-primaryDark shadow-md text-white text-center py-8 mt-auto">
      <p class="text-lg">&copy; 2025 TopLaw. Sva prava pridržana.</p>
    </footer>
  </div>
</template>

<style scoped>
/* Po želji */
</style>
