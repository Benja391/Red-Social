<script>
import BaseButton from '../components/BaseButton.vue';
import MainInput from '../components/MainInput.vue';
import { login } from '../services/auth';
import BaseHeading1 from '../components/BaseHeading1.vue';

export default {
  name: "Login",
  components: { MainInput, BaseButton, BaseHeading1 },

  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      loading: false,
      feedbackMessage: '', // Mensaje de feedback
      feedbackClass: '',   // Clase CSS para estilos del feedback
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;

      // Validaciones
      if (!this.user.email.trim() || !this.user.password.trim()) {
        this.showFeedback('Por favor, completa todos los campos.', 'bg-red-100 text-red-700');
        this.loading = false;
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.user.email)) {
        this.showFeedback('Por favor, ingresa un email válido.', 'bg-red-100 text-red-700');
        this.loading = false;
        return;
      }

      if (this.user.password.length < 6) {
        this.showFeedback('La contraseña debe tener al menos 6 caracteres.', 'bg-red-100 text-red-700');
        this.loading = false;
        return;
      }

      // Intentar iniciar sesión
      try {
        await login(this.user.email, this.user.password);

        // Mostrar mensaje de éxito
        this.showFeedback('Inicio de sesión exitoso.', 'bg-green-100 text-green-700');

        // Redirigir al perfil
        setTimeout(() => {
          this.$router.push({ path: '/perfil' });
        }, 1000); // Breve pausa para que el usuario vea el mensaje
      } catch (error) {
        console.error('Error al iniciar sesión:', error);

        // Mostrar mensaje de error
        this.showFeedback('Error al iniciar sesión. Verifica tus credenciales.', 'bg-red-100 text-red-700');
      } finally {
        this.loading = false;
      }
    },
    showFeedback(message, cssClass) {
      this.feedbackMessage = message;
      this.feedbackClass = cssClass;

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        this.feedbackMessage = '';
        this.feedbackClass = '';
      }, 3000);
    },
  },
};
</script>

<template>
  <section class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <BaseHeading1>Ingresa con tu cuenta</BaseHeading1>

      <!-- Mensaje de Feedback -->
      <div v-if="feedbackMessage" :class="['p-4 rounded mb-4', feedbackClass]">
        {{ feedbackMessage }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="email" class="block mb-1">Email</label>
          <MainInput 
            type="email"
            id="email"
            v-model="user.email"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block mb-1">Contraseña</label>
          <MainInput 
            type="password"
            id="password"
            v-model="user.password"
          />
        </div>
        <BaseButton type="submit" :disabled="loading">
          {{ loading ? 'Cargando...' : 'Ingresar' }}
        </BaseButton>
      </form>
    </div>
  </section>
</template>
