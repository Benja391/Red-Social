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
  <div class="max-w-6xl mx-auto mt-4  mb-16 px-6">
    <!-- Título principal -->
    <h1 class="text-center text-4xl font-extrabold text-white mb-10 tracking-wide">
      Chat
    </h1>

    <!-- Mensaje de Feedback -->
    <div
      v-if="feedbackMessage"
      :class="[
        'p-4 mb-6 text-center rounded-xl font-semibold shadow-md',
        feedbackClass || 'bg-blue-600 text-white'
      ]"
    >
      {{ feedbackMessage }}
    </div>

    <!-- Layout principal -->
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Sección de mensajes -->
      <main
        class="flex-1 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-5 overflow-hidden"
      >
        <h2 class="text-xl font-semibold text-gray-200 mb-4">Mensajes</h2>

        <div
          class="bg-gray-900 border border-blue-400 rounded-xl p-4 h-[500px] overflow-y-auto custom-scrollbar"
        >
          <ul v-if="!loadingMessages" class="space-y-4">
            <li
              v-for="message in messages"
              :key="message.id"
              class="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm transition hover:border-blue-400"
            >
              <header class="flex items-center justify-between mb-2">
                <router-link
                  :to="`/usuario/${message.userId}`"
                  class="text-blue-400 font-semibold hover:underline"
                >
                  {{ message.email }}
                </router-link>
                <span class="text-sm text-gray-400">{{ formatDate(message.created_at) }}</span>
              </header>
              <p class="text-gray-200 leading-relaxed">{{ message.content }}</p>
            </li>
          </ul>

          <div v-else class="flex justify-center items-center py-10">
            <Loader />
          </div>
        </div>
      </main>

      <!-- Sidebar: enviar mensaje -->
      <aside
        class="md:w-1/3 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col justify-between h-[500px] overflow-y-auto custom-scrollbar"
      >
        <h2 class="text-2xl font-semibold text-white mb-6 text-center">
          Enviar un mensaje
        </h2>

        <form @submit.prevent="sendMessage" class="space-y-4">
          <!-- Email actual -->
          <div>
            <span class="block text-gray-400 text-sm mb-2">Tu Email</span>
            <p class="text-blue-400 font-semibold">{{ authUser.email }}</p>
          </div>

          <!-- Campo mensaje -->
          <div>
            <label for="message" class="block text-gray-300 font-medium mb-2">Mensaje</label>
            <textarea
              id="message"
              class="w-full p-3 bg-gray-900 text-white border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
              v-model="newMessage.content"
              aria-label="Campo para escribir el mensaje"
              :disabled="isSending"
              placeholder="Escribí tu mensaje..."
              rows="4"
            ></textarea>
          </div>

          <!-- Botón enviar -->
          <BaseButton
            :disabled="isSending"
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
          >
            {{ isSending ? "Enviando..." : "Enviar" }}
          </BaseButton>
        </form>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar más limpia y discreta */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #1f2937; /* gris oscuro */
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #3b82f6; /* azul */
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #2563eb;
}
</style>



