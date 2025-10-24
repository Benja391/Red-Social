<template>
  <!-- Contenedor principal -->
  <div class="relative min-h-screen flex flex-col text-white bg-gray-900 overflow-x-hidden">
    <!-- 🔹 Fondo global (degradado oscuro elegante) -->
  <div class="absolute inset-0 bg-gradient-to-b from-[#0b0f19] via-[#2d3748] to-[#111827] -z-10"></div>




    <!-- 🔹 Navbar -->
    <nav
      class="bg-gray-900/90 border-b border-gray-800 p-4 flex justify-between items-center shadow-md backdrop-blur-sm sticky top-0 z-50"
    >
      <p class="text-2xl flex items-center">
        <router-link to="/">
          <img
            class="w-12 h-12 object-contain transition-transform duration-200 hover:scale-105"
            src="/logo-red-sin-fondo.png"
            alt="Logo"
          />
        </router-link>
      </p>

      <ul class="flex gap-6 text-sm font-medium items-center">
        <li>
          <router-link
            to="/"
            class="hover:text-blue-400 transition duration-150"
          >
            Inicio
          </router-link>
        </li>

        <template v-if="authUser.id == null">
          <li>
            <router-link
              to="/iniciar-sesion"
              class="hover:text-blue-400 transition duration-150"
            >
              Iniciar sesión
            </router-link>
          </li>
          <li>
            <router-link
              to="/registro"
              class="hover:text-blue-400 transition duration-150"
            >
              Registrarse
            </router-link>
          </li>
        </template>

        <template v-else>
          <li>
            <router-link
              to="/chat"
              class="hover:text-blue-400 transition duration-150"
            >
              Chat Público
            </router-link>
          </li>
          <li>
            <router-link
              to="/perfil"
              class="hover:text-blue-400 transition duration-150"
            >
              Mi Perfil
            </router-link>
          </li>
          <li>
            <router-link
              to="/posts"
              class="hover:text-blue-400 transition duration-150"
            >
              Posteos
            </router-link>
          </li>
          <li>
            <router-link
              to="/create-post"
              class="hover:text-blue-400 transition duration-150"
            >
              Crear Posteo
            </router-link>
          </li>
          <li>
            <form action="#" @submit.prevent="handleLogout" class="flex items-center gap-2">
              <button
                class="flex items-center gap-2 text-sm text-gray-300 hover:text-red-400 transition duration-200"
              >
                {{ authUser.email }}
                <span v-if="authUser.role" class="opacity-70 text-xs italic">
                  ({{ authUser.role }})
                </span>
                <img
                  class="w-4 h-4 inline-block opacity-80 hover:opacity-100"
                  src="../public/cerrar-sesion.png"
                  alt="Cerrar sesión"
                />
              </button>
            </form>
          </li>
        </template>
      </ul>
    </nav>

    <!-- 🔹 Contenido principal -->
    <main class="flex-grow mt-3 mb-10 px-6">
      <router-view />
    </main>
  </div>
</template>


<script>
import Home from './pages/Home.vue';
import { logout, subscribeToAuth } from './services/auth';
import { getUserRole } from './services/user-profile';

export default {
  name: 'App',
  components: { Home, logout },
  data() {
    return {
      authUser: {
        id: null,
        email: null,
        role: null,
      },
      isAuthenticating: true,
    };
  },
  methods: {
    handleLogout() {
      logout();
      this.$router.push({ path: '/iniciar-sesion' });
    },
    async updateUserRole() {
      if (this.authUser.id && !this.authUser.role) {
        const role = await getUserRole(this.authUser.id);
        this.authUser.role = role;
      }
    },
  },
  mounted() {
    subscribeToAuth(async (newUserData) => {
      if (newUserData && newUserData.id) {
        if (this.authUser.id !== newUserData.id) {
          this.authUser = { ...newUserData };
          this.isAuthenticating = false;
          await this.updateUserRole();
        }
      } else {
        this.authUser = { id: null, email: null, role: null };
        this.isAuthenticating = false;
      }
    });
  },
  watch: {
    'authUser.id'(newId) {
      if (newId) this.updateUserRole();
    },
  },
};
</script>