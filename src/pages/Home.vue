<script setup>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function redirectToRegister() {
  router.push('/registro'); // Asegúrate de que la ruta '/register' exista
}
</script>

<template>
  <section class="flex flex-col items-start justify-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-500 text-black p-8">
    <BaseHeading1 class="text-5xl font-bold mb-6">¡Bienvenido a Nuestra Red Social!</BaseHeading1>

    <p class="text-lg mb-6 max-w-xl">
      Conéctate con amigos y comparte tus momentos más especiales. En nuestra red social, puedes organizar y disfrutar de tus actividades diarias con facilidad.
    </p>

    <p class="text-md mb-8 max-w-md">
      Inicia sesión o crea una cuenta para unirte a nuestra comunidad y descubrir un mundo lleno de nuevas conexiones, experiencias compartidas y un mejor control de tus interacciones sociales.
    </p>

    <button 
      @click="redirectToRegister"
      class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
    >
      Regístrate Ahora
    </button>
  </section>
</template>
