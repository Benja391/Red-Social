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
    <section class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <BaseHeading1>Crea una cuenta</BaseHeading1>

            <!-- Mensaje de Feedback -->
            <div v-if="feedbackMessage" :class="['p-4 rounded mb-4', feedbackClass]">
                {{ feedbackMessage }}
            </div>

            <form @submit.prevent="handleSubmit" class="mb-6">
                <div class="mb-3">
                    <label for="email" class="block mb-1">Email</label>
                    <MainInput 
                        type="email"
                        id="email"
                        v-model="user.email"
                        class="mb-4"
                    />
                </div>
                <div class="mb-3">
                    <label for="password" class="block mb-1">Contraseña</label>
                    <MainInput 
                        type="password"
                        id="password"
                        v-model="user.password"
                        class="mb-4"
                    />
                </div>
                <BaseButton type="submit" class="w-full" :disabled="loading">
                    {{ loading ? 'Creando cuenta...' : '¡Crea tu cuenta!' }}
                </BaseButton>
            </form>
        </div>
    </section>
</template>
