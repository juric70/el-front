<template>
  <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 text-primaryDark"
  >
    <div class="bg-white p-6 rounded shadow-md w-80">
      <h2 class="text-lg font-bold mb-4">Kreiraj novi razgovor</h2>

      <input
          v-model="title"
          type="text"
          placeholder="Naziv razgovora"
          class="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none focus:border-blue-500"
      />

      <div class="flex justify-end space-x-2">
        <button
            @click="cancel"
            class="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          Otkaži
        </button>
        <button
            @click="save"
            class="px-4 py-2 bg-primary text-white rounded hover:bg-primaryDark"
        >
          Spremi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

const title = ref('')


function save() {
  emit('save', title.value)
}

function cancel() {
  emit('cancel')
}
</script>
