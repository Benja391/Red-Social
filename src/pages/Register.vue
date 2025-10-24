<script>
import BaseButton from '../components/BaseButton.vue';
import BaseHeading1 from '../components/BaseHeading1.vue';
import MainInput from '../components/MainInput.vue';
import { register } from '../services/auth';

export default {
    name: "Register",
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
    watch: {
        // Oculta automáticamente el mensaje de error cuando el usuario edita un campo
        'user.email'(newValue) {
            if (this.feedbackClass.includes('text-red-700')) {
                this.clearFeedback();
            }
        },
        'user.password'(newValue) {
            if (this.feedbackClass.includes('text-red-700')) {
                this.clearFeedback();
            }
        },
    },
    methods: {
        async handleSubmit() {
            this.feedbackMessage = '';
            this.feedbackClass = '';
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

            try {
                // Llama al servicio de registro
                await register(this.user.email, this.user.password);
                this.showFeedback('¡Cuenta creada exitosamente!', 'bg-green-100 text-green-700');
                setTimeout(() => {
                    this.$router.push({ path: '/perfil' });
                }, 1500); // Redirige después de mostrar el mensaje
            } catch (error) {
                console.error('Error al registrarse:', error.message);
                if (error.code === 'auth/email-already-in-use') {
                    this.showFeedback('El email ya está registrado.', 'bg-red-100 text-red-700');
                } else if (error.code === 'auth/weak-password') {
                    this.showFeedback('La contraseña debe tener al menos 6 caracteres.', 'bg-red-100 text-red-700');
                } else {
                    this.showFeedback('Hubo un problema al crear tu cuenta. Intenta nuevamente.', 'bg-red-100 text-red-700');
                }
            } finally {
                this.loading = false;
            }
        },
        showFeedback(message, cssClass) {
            this.feedbackMessage = message;
            this.feedbackClass = cssClass;

            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                this.clearFeedback();
            }, 3000);
        },
        clearFeedback() {
            this.feedbackMessage = '';
            this.feedbackClass = '';
        },
    },
};
</script>

<template>
  <section class="flex flex-col items-center justify-center min-h-screen bg-blue-100 text-gray-900 px-6">
    <div class="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <BaseHeading1 class="text-3xl font-extrabold text-center text-gray-900 mb-8">
        Creá tu cuenta
      </BaseHeading1>

      <!-- Mensaje de Feedback -->
      <div v-if="feedbackMessage" :class="['p-4 rounded mb-6 text-sm font-medium', feedbackClass]">
        {{ feedbackMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block mb-2 text-sm font-semibold text-gray-700">Email</label>
          <MainInput 
            type="email"
            id="email"
            v-model="user.email"
            class="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        <!-- Contraseña -->
        <div>
          <label for="password" class="block mb-2 text-sm font-semibold text-gray-700">Contraseña</label>
          <MainInput 
            type="password"
            id="password"
            v-model="user.password"
            class="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        <!-- Botón -->
        <BaseButton 
          type="submit"
          :disabled="loading"
          class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 shadow-sm hover:shadow-md transition-all duration-300"
        >
          {{ loading ? 'Creando cuenta...' : '¡Creá tu cuenta!' }}
        </BaseButton>
      </form>

      <!-- Divider -->
      <div class="flex items-center justify-center my-8">
        <span class="h-px bg-gray-200 w-20"></span>
        <span class="text-sm text-gray-400 mx-3">o</span>
        <span class="h-px bg-gray-200 w-20"></span>
      </div>

      <!-- Enlace a Iniciar Sesión -->
      <p class="text-center text-sm text-gray-600">
        ¿Ya tenés una cuenta?
        <a href="/login" class="text-blue-600 font-semibold hover:underline">
          Iniciá sesión
        </a>
      </p>
    </div>
  </section>
</template>
