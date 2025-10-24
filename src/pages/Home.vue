<script setup>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function redirectToRegister() {
  router.push('/registro');
}
</script>

<template>
  <section class="w-full min-h-screen bg-white text-gray-900 overflow-hidden">

    <!-- HERO PRINCIPAL -->
    <div class="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 bg-blue-50">
      <BaseHeading1 class="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
        ¡Bienvenido a <span class="text-blue-600">Nuestra Red Social</span>!
      </BaseHeading1>

      <p class="text-lg text-gray-600 max-w-2xl mb-8">
        Conectate con tus amigos, compartí tus momentos y descubrí un lugar donde podés expresarte libremente, sin límites.
      </p>

      <button 
        @click="redirectToRegister"
        class="px-10 py-4 bg-blue-600 text-white font-semibold text-lg rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        ¡Únete Ahora!
      </button>
    </div>

    <!-- SECCIÓN DE BENEFICIOS -->
    <div class="grid md:grid-cols-3 gap-10 px-8 py-20 bg-white max-w-6xl mx-auto text-center">
      <div
        class="space-y-4 bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
      >
        <div class="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold shadow-inner">💬</div>
        <h3 class="text-xl font-bold text-gray-800">Conectá con Amigos</h3>
        <p class="text-gray-500 text-sm leading-relaxed">
          Interactuá con personas que comparten tus intereses. Publicá, comentá y participá de comunidades activas.
        </p>
      </div>

      <div
        class="space-y-4 bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
      >
        <div class="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold shadow-inner">📸</div>
        <h3 class="text-xl font-bold text-gray-800">Compartí Momentos</h3>
        <p class="text-gray-500 text-sm leading-relaxed">
          Subí fotos, videos o historias y mantené vivos tus recuerdos con quienes más querés.
        </p>
      </div>

      <div
        class="space-y-4 bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
      >
        <div class="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold shadow-inner">🚀</div>
        <h3 class="text-xl font-bold text-gray-800">Crecé con la Comunidad</h3>
        <p class="text-gray-500 text-sm leading-relaxed">
          Descubrí contenido nuevo, seguí a tus creadores favoritos y construí tu presencia online.
        </p>
      </div>
    </div>

    <!-- CTA FINAL -->
    <div class="bg-blue-600 text-white text-center py-20 px-6">
      <h2 class="text-3xl font-extrabold mb-4">Tu nueva comunidad te está esperando </h2>
      <p class="text-base mb-8 text-blue-100 max-w-2xl mx-auto">
        Unite hoy y empezá a crear conexiones reales, compartir experiencias y disfrutar de lo que más te gusta.
      </p>
      <button 
        @click="redirectToRegister"
        class="px-10 py-4 bg-white text-blue-700 font-semibold text-lg rounded-xl hover:bg-blue-100 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Registrate Gratis
      </button>
    </div>

    <!-- FOOTER -->
    <footer class="bg-gray-100 text-gray-500 text-center py-6 text-sm">
      © 2025 Nuestra Red Social — Conectá. Compartí. Crecé.
    </footer>
  </section>
</template>
