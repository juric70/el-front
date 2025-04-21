<template>
  <div class="min-h-screen bg-white text-gray-900 flex flex-col">
    <!-- Hero -->
    <section class="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-primaryDark via-primary to-gray-50 text-white">
      <h2 class="text-5xl font-extrabold mb-4">Upoznajte nas</h2>
      <p class="text-xl max-w-2xl">Iza aplikacije TopLaw stoji tim entuzijastičnih studenata koji povezuju pravo i tehnologiju.</p>
    </section>

    <!-- Tko smo mi -->
    <section class="py-16 px-6 bg-gray-50 text-center">
      <h3 class="text-3xl font-bold mb-10 text-primary">Tko smo mi?</h3>
      <p class="max-w-3xl mx-auto text-lg text-gray-700 mb-12">
        Mi smo tim studenata Fakulteta strojarstva, računarstva i elektrotehnike Sveučilišta u Mostaru, koji razvijaju aplikaciju <strong>TopLaw</strong> u sklopu kolegija <em>Elektroničko poslovanje</em>.
      </p>
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="p-6 border rounded-xl shadow-md bg-white">
          <img src="/team/andela.jpeg" alt="Anđela Jurić" class="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-primary">
          <h4 class="text-xl font-semibold text-primary mb-1">Anđela Jurić</h4>
          <p class="text-gray-600">Frontend & UX dizajn</p>
        </div>
        <div class="p-6 border rounded-xl shadow-md bg-white">
          <img src="/team/andjela.jpg" alt="Andrija Soldo" class="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-primary">
          <h4 class="text-xl font-semibold text-primary mb-1">Andrija Soldo</h4>
          <p class="text-gray-600">Backend & dokumentacija</p>
        </div>
        <div class="p-6 border rounded-xl shadow-md bg-white">
          <img src="/team/andjela.jpg" alt="Petar Bošnjak" class="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-primary">
          <h4 class="text-xl font-semibold text-primary mb-1">Petar Bošnjak</h4>
          <p class="text-gray-600">AI logika & integracije</p>
        </div>
      </div>
    </section>

    <!-- Funkcionalnosti -->
    <section class="py-20 px-6 text-center bg-white">
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
          <h4 class="text-xl font-semibold mb-2 text-primary">✍️ Potpisivanje</h4>
          <p class="text-gray-700">Digitalno potpišite pravne dokumente.</p>
        </div>
        <div class="p-6 border rounded-xl shadow-md bg-gray-50">
          <h4 class="text-xl font-semibold mb-2 text-primary">✅ Verifikacija</h4>
          <p class="text-gray-700">Provjerite autentičnost potpisanih dokumenata.</p>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-20 px-6 bg-gray-50 text-center">
      <h3 class="text-3xl font-bold mb-10 text-primary">Najčešća pitanja</h3>
      <div class="max-w-4xl mx-auto text-left space-y-8">
        <div>
          <h4 class="text-xl font-semibold text-primary">Kako mogu koristiti AI odvjetnika?</h4>
          <p class="text-gray-700">Jednostavno kliknite na “Pokreni chat” na početnoj stranici i postavite svoje pitanje.</p>
        </div>
        <div>
          <h4 class="text-xl font-semibold text-primary">Jesu li generirani dokumenti pravno valjani?</h4>
          <p class="text-gray-700">Dokumenti su generirani prema predlošcima, ali se preporučuje provjera sa stručnjakom prije službene upotrebe.</p>
        </div>
        <div>
          <h4 class="text-xl font-semibold text-primary">Je li moj potpis siguran?</h4>
          <p class="text-gray-700">Vaš potpis se pohranjuje sigurno i koristi se samo za dokumente koje vi osobno generirate.</p>
        </div>
        <div>
          <h4 class="text-xl font-semibold text-primary">Kako mogu provjeriti autentičnost dokumenta?</h4>
          <p class="text-gray-700">Unesite ID razgovora u sekciji “Verifikacija” i sustav će potvrditi identitet i potpis.</p>
        </div>
      </div>
    </section>

    <!-- Kontakt -->
    <section class="py-20 px-6 text-center bg-white">
      <h3 class="text-3xl font-bold mb-10 text-primary">Kontakt</h3>
      <p class="text-lg text-gray-700 max-w-xl mx-auto mb-6">
        Ako imate pitanja, prijedloge ili trebate pomoć, slobodno nam se javite.
      </p>
      <p class="text-gray-800 font-semibold">📧 Email: <a href="mailto:toplaw@gmail.com" class="text-primary hover:underline">toplaw@gmail.com</a></p>
    </section>
  </div>
</template>

<script setup>
// statička stranica – nije potreban JS
</script>

<style scoped>
</style>
