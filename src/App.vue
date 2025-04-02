<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="bg-blue-600 p-4 flex justify-between items-center text-white">
      <p class="text-2xl">
        <router-link to="/">
          <img class="w-13 h-12" src="/logo-red-social.png" alt="Logo">
        </router-link>
      </p>
      <ul class="flex gap-4">
        <li><router-link to="/">Inicio</router-link></li>

        <template v-if="authUser.id == null">
          <li><router-link to="/iniciar-sesion">Iniciar sesión</router-link></li>
          <li><router-link to="/registro">Registrarse</router-link></li>
        </template>

        <template v-else>
          <li><router-link to="/chat">Chat Público</router-link></li>
          <li><router-link to="/perfil">Mi Perfil</router-link></li>
          <li><router-link to="/posts">Posteos</router-link></li>
          <li><router-link to="/create-post">Crear Posteo</router-link></li>
          <li>
            <form action="#" @submit.prevent="handleLogout">
              <button class="flex items-center gap-2">
                {{ authUser.email }} 
                <span v-if="authUser.role">({{ authUser.role }})</span> <!-- Mostrar el rol entre paréntesis -->
                <img class="w-5 h-5 inline-block" src="../public/cerrar-sesion.png" alt="Cerrar sesión">
              </button>
            </form>
          </li>
        </template>
      </ul>
    </nav>

    <!-- Main Content -->
    <main class="container mx-auto p-6 bg-gray-700 text-white flex-grow">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-blue-600 text-white text-center py-4 mt-auto">
      Copyright &copy; Red Social 2024
    </footer>
  </div>
</template>

<script>
import Home from './pages/Home.vue';
import { logout, subscribeToAuth } from './services/auth';
import { getUserRole } from './services/user-profile'; // Importa la función para obtener el rol

export default {
    name: 'App',
    components: { Home, logout },

    data() {
        return {
            authUser: {
                id: null,
                email: null,
                role: null,  // Agregamos el rol
            },
            isAuthenticating: true, // Bandera para manejar la autenticación
        };
    },
    methods: {
        handleLogout() {
            logout();
            this.$router.push({
                path: '/iniciar-sesion'
            });
        },
        async updateUserRole() {
            if (this.authUser.id && !this.authUser.role) {
                // Solo obtenemos el rol si el ID está disponible y el rol aún no ha sido asignado
                const role = await getUserRole(this.authUser.id);
                this.authUser.role = role; // Actualizamos el rol del usuario
            }
        }
    },

    mounted() {
        // Suscribir al estado de autenticación
        subscribeToAuth(async (newUserData) => {
            if (newUserData && newUserData.id) {
                if (this.authUser.id !== newUserData.id) {
                    // Solo actualizamos si el usuario ha cambiado
                    this.authUser = { ...newUserData };
                    this.isAuthenticating = false; // Desactivar la bandera de autenticación
                    await this.updateUserRole(); // Obtener el rol del usuario
                }
            } else {
                // Restablecer el usuario cuando no está autenticado
                this.authUser = { id: null, email: null, role: null };
                this.isAuthenticating = false;
            }
        });
    },

    watch: {
        'authUser.id'(newId) {
            // Si el ID cambia, actualizamos el rol del usuario
            if (newId) {
                this.updateUserRole();
            }
        }
    }
};
</script>
