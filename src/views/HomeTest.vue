<template>
  <div class="min-h-screen bg-white text-gray-900 flex flex-col">
    <section class="flex flex-col items-center justify-center text-center py-24 bg-gradient-to-b from-primaryDark via-primary  to-gray-50 to-10% text-white">
      <h2 class="text-5xl font-extrabold mb-6">Pravna pomoć, brzo i jednostavno</h2>
      <p class="text-xl max-w-3xl mb-6">Dobijte besplatne pravne savjete ili se povežite s odvjetnicima putem naše moderne platforme.</p>
      <button class="px-8 py-3 bg-white text-primary font-semibold rounded-full shadow-md hover:bg-gray-100 transition"
              onclick="window.location.href='/chat'">
        Pokreni chat
      </button>

    </section>

    <section id="services" class="py-20 px-8 text-center bg-gray-50">
      <h3 class="text-3xl font-bold mb-10 text-primary">Naše usluge</h3>
      <div class="grid md:grid-cols-4 gap-10" onclick="window.location.href='/chat'">
        <div class="p-8 border rounded-xl shadow-lg bg-white">
          <h4 class="text-2xl font-semibold mb-4 text-primary">AI odvjetnik</h4>
          <p class="text-lg text-gray-700">Brzi odgovori na osnovna pravna pitanja putem chata.</p>
        </div>
        <div class="p-8 border rounded-xl shadow-lg bg-white" onclick="window.location.href='/documents'">
          <h4 class="text-2xl font-semibold mb-4 text-primary"> Generiranje pravnih dokumenata</h4>
          <p class="text-lg text-gray-700">Preuzmite i prilagodite predloške pravnih dokumenata.</p>
        </div>
        <div class="p-8 border rounded-xl shadow-lg bg-white" onclick="window.location.href='/signature'">
          <h4 class="text-2xl font-semibold mb-4 text-primary">Digitalno potpisivanje dokumenata</h4>
          <p class="text-lg text-gray-700">Pronađite pravne stručnjake za svoje potrebe.</p>
        </div>
        <div class="p-8 border rounded-xl shadow-lg bg-white" onclick="window.location.href='/laws'">
          <h4 class="text-2xl font-semibold mb-4 text-primary">Brz pristup pravnim propisima i zakonima</h4>
          <p class="text-lg text-gray-700">Pronađite pravne stručnjake za svoje potrebe.</p>
        </div>
      </div>
    </section>

  </div>
 </template>

<script setup>
</script>

<style>
</style>