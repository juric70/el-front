<template>
  <div class="min-h-screen bg-white text-gray-900 flex flex-col">
    <!-- Hero sekcija -->
    <section class="flex flex-col items-center justify-center text-center py-24 bg-gradient-to-b from-primaryDark via-primary to-gray-50 text-white">
      <h2 class="text-5xl font-extrabold mb-6">Upoznajte nas</h2>
      <p class="text-xl max-w-3xl mb-6">Iza aplikacije TopLaw stoji tim entuzijastičnih studenata FSRE-a u Mostaru koji povezuju pravo i tehnologiju.</p>
    </section>

    <!-- O nama sekcija -->
    <section class="py-20 px-8 bg-gray-50 text-center">
      <h3 class="text-3xl font-bold mb-10 text-primary">Tko smo mi?</h3>
      <p class="max-w-3xl mx-auto text-lg text-gray-700 mb-12">
        Mi smo tim studenata Fakulteta strojarstva, računarstva i elektrotehnike Sveučilišta u Mostaru, okupljeni oko zajedničkog projekta za kolegij <strong>Elektroničko poslovanje</strong>.
        Naš cilj je olakšati pristup osnovnim pravnim uslugama pomoću moderne tehnologije i umjetne inteligencije.
      </p>
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="p-6 border rounded-xl shadow-md bg-white">
          <img src="/team/andela.jpeg" alt="Anđela Jurić" class="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-primary">
          <h4 class="text-xl font-semibold text-primary mb-1">Anđela Jurić</h4>
          <p class="text-gray-600">Frontend & UX dizajn & DevOps</p>
        </div>
        <div class="p-6 border rounded-xl shadow-md bg-white">
          <img src="/team/andjela.jpg" alt="Andrija Soldo" class="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-primary">
          <h4 class="text-xl font-semibold text-primary mb-1">Andrija Soldo</h4>
          <p class="text-gray-600">Backend AI logika & integracije</p>
        </div>
        <div class="p-6 border rounded-xl shadow-md bg-white">
          <img src="/team/andjela.jpg" alt="Petar Bošnjak" class="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-primary">
          <h4 class="text-xl font-semibold text-primary mb-1">Petar Bošnjak</h4>
          <p class="text-gray-600">Dokumentacije i prezentacije</p>
        </div>
      </div>
    </section>

    <!-- Funkcionalnosti -->
    <section class="py-20 px-8 text-center bg-white">
      <h3 class="text-3xl font-bold mb-10 text-primary">Što nudi TopLaw?</h3>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <div class="p-6 border rounded-xl shadow-md bg-gray-50">
          <h4 class="text-xl font-semibold mb-2 text-primary">💬 AI odvjetnik</h4>
          <p class="text-gray-700">Razgovarajte s pravnim savjetnikom temeljenim na umjetnoj inteligenciji.</p>
        </div>
        <div class="p-6 border rounded-xl shadow-md bg-gray-50">
          <h4 class="text-xl font-semibold mb-2 text-primary">📄 Generiranje dokumenata</h4>
          <p class="text-gray-700">Kreirajte pravne dokumente u PDF i Word formatu.</p>
        </div>
        <div class="p-6 border rounded-xl shadow-md bg-gray-50">
          <h4 class="text-xl font-semibold mb-2 text-primary">📚 Pretraga zakona</h4>
          <p class="text-gray-700">Jednostavan pristup zakonima i propisima RH.</p>
        </div>
        <div class="p-6 border rounded-xl shadow-md bg-gray-50">
          <h4 class="text-xl font-semibold mb-2 text-primary">✍️ Potpisivanje dokumenata</h4>
          <p class="text-gray-700">Digitalno potpišite generirane dokumente.</p>
        </div>
        <div class="p-6 border rounded-xl shadow-md bg-gray-50">
          <h4 class="text-xl font-semibold mb-2 text-primary">✅ Verifikacija</h4>
          <p class="text-gray-700">Provjerite autentičnost potpisanih dokumenata.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Nema dodatne logike za sada
</script>

<style scoped>
/* Dodatni stilovi ako želiš nešto posebno */
</style>
