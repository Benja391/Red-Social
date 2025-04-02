<script>
import MainInput from '../components/MainInput.vue'
import { saveChatMessage, subscribeToChatMessage } from '../services/chat';
import { subscribeToAuth } from '../services/auth';
import BaseButton from '../components/BaseButton.vue'

export default {
    name: "Chat",
    components: { MainInput, BaseButton },
    data: () => {
        return {
            messages: [],
            loadingMessages: true,
            unsuscribeFromChat: () => {},
            newMessage: {
                content: '',
            },
            authUser: {
                id: null,
                email: null,
            },
            unsuscribeFromAuth: () => {},
            feedbackMessage: '',  // Mensaje de feedback
            feedbackClass: '',    // Clase de feedback (verde/rojo)
            isSending: false,     // Estado de carga del botón
        };
    },
    methods: {
        sendMessage() {
            if (!this.newMessage.content.trim()) {
                this.showFeedback('El mensaje no puede estar vacío.', 'bg-red-100 text-red-700');
                return;
            }

            this.isSending = true; // Activar estado de carga del botón

            saveChatMessage({
                UserId: this.authUser.id,
                email: this.authUser.email,
                content: this.newMessage.content,
            }).then(() => {
                this.newMessage.content = ''; // Limpiar campo de mensaje
                this.showFeedback('Mensaje enviado con éxito.', 'bg-green-100 text-green-700');
            }).catch(error => {
                console.error('Error al enviar el mensaje:', error);
                this.showFeedback('Hubo un error al enviar el mensaje.', 'bg-red-100 text-red-700');
            }).finally(() => {
                this.isSending = false; // Desactivar estado de carga del botón
            });
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

        formatDate(date) {
            return Intl.DateTimeFormat('es-Ar', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: 'numeric', minute: '2-digit', second: '2-digit',
            }).format(date).replace(',', ' ');
        }
    },
    userRoute(id) {
        return id !== this.authUser.id ? `usuario/${id}` : `perfil`;
    },
    mounted() {
        this.unsuscribeFromChat = subscribeToChatMessage((newMessages) => {
            this.messages = newMessages;
            this.loadingMessages = false;
        });
        this.unsuscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);
    },
    unmounted() {
        this.unsuscribeFromAuth();
        this.unsuscribeFromChat();
    }
};
</script>

<template>
    <h1 class="text-center text-3xl font-bold text-white mb-6">Chat</h1>

    <!-- Mensaje de Feedback -->
    <div v-if="feedbackMessage" :class="['p-4 rounded mb-4', feedbackClass]">
        {{ feedbackMessage }}
    </div>

    <div class="flex gap-4">
        <main class="w-3/4">
            <h2 class="sr-only">Lista de mensajes</h2>

            <div class="min-h-[400px] p-4 border-[2px] border-[#83B1DF] rounded">
                <ul v-if="!loadingMessages">
                    <li v-for="message in messages" :key="message.id" class="mb-3">
                        <article>
                            <header>
                                <router-link :to="`/usuario/${message.userId}`">
                                    <strong>{{ message.email }}</strong>
                                </router-link>
                                <span class="text-gray-500">{{ formatDate(message.created_at) }}</span>
                            </header>
                            <p>{{ message.content }}</p>
                        </article>
                    </li>
                </ul>

                <div v-else class="flex justify-center items-center">
                    <Loader />
                </div>
            </div>
        </main>

        <aside class="w-1/4">
            <h2 class="mb-4">Enviar un mensaje</h2>

            <form @submit.prevent="sendMessage">
                <div class="mb-3">
                    <span class="block mb-2">Email</span>
                    <span>{{ authUser.email }}</span>
                </div>
                <div class="mb-3">
                    <label for="message" class="block mb-2">Mensaje</label>
                    <textarea
                        id="message"
                        class="bg-[#616160] w-full p-4 border border-[#83B1DF] rounded"
                        v-model="newMessage.content"
                        aria-label="Campo para escribir el mensaje"
                        :disabled="isSending"
                    ></textarea>
                </div>
                <BaseButton :disabled="isSending" type="submit">
                    {{ isSending ? 'Enviando...' : 'Enviar' }}
                </BaseButton>
            </form>
        </aside>
    </div>
</template>
