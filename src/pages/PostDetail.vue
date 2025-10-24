<script>
import { db } from "../services/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getPostById } from "../services/posts";
import BaseButton from "../components/BaseButton.vue";

export default {
  components: { BaseButton },
  data() {
    return {
      post: {},
      comments: [],
      newComment: "",
      authUser: null,
      isAdding: false, // Estado de carga
      feedbackMessage: null, // Mensaje de feedback
    };
  },
  async mounted() {
    try {
      const postId = this.$route.params.id;
      console.log(`Fetching profile for post ID: ${postId}`);
      this.post = await getPostById(postId);

      const commentsQuery = query(
        collection(db, "comments"),
        where("postId", "==", postId)
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      commentsSnapshot.forEach((doc) => {
        this.comments.push(doc.data());
      });

      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.authUser = user;
        }
      });
    } catch (error) {
      console.error("Error al cargar el post o los comentarios:", error);
    }
  },
  methods: {
    async addComment() {
      if (!this.newComment) return;
      if (!this.authUser) {
        console.error("Usuario no autenticado");
        return;
      }

      this.isAdding = true; // Activar estado de carga

      try {
        const comment = {
          text: this.newComment,
          author: this.authUser.email,
          postId: this.$route.params.id,
          createdAt: new Date(),
        };
        await addDoc(collection(db, "comments"), comment);
        this.comments.push(comment);
        this.newComment = "";

        // Mostrar mensaje de feedback
        this.feedbackMessage = "Comentario agregado con éxito.";
        setTimeout(() => {
          this.feedbackMessage = null; // Ocultar mensaje después de 2 segundos
        }, 2000);
      } catch (error) {
        console.error("Error al añadir el comentario:", error);
      } finally {
        this.isAdding = false; // Desactivar estado de carga
      }
    },
  },
};
</script>

<template>
  <div class="max-w-3xl mx-auto mt-4  mb-16 px-6">
    <!-- Título -->
    <h1 class="text-center text-4xl font-extrabold text-white mb-10 tracking-wide">
      {{ post.title }}
    </h1>

    <!-- Información del autor -->
    <p class="text-gray-700 text-center mb-6">
      <strong class="text-blue-400">Creado por:</strong> {{ post.userEmail }}
    </p>

    <!-- Imagen principal -->
    <div class="rounded-2xl overflow-hidden shadow-lg border border-gray-700 mb-10">
      <img
        :src="post.imageUrl"
        alt="Imagen del post"
        class="w-full h-80 object-cover"
      />
    </div>

    <!-- Sección de comentarios -->
    <div class="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 mb-10">
      <h2 class="text-2xl font-semibold text-white mb-4">Comentarios</h2>

      <!-- Lista de comentarios -->
      <ul v-if="comments.length > 0" class="space-y-4">
        <li
          v-for="comment in comments"
          :key="comment.id"
          class="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:bg-gray-850 transition"
        >
          <p class="text-sm text-blue-400 mb-1"><em>{{ comment.author }}:</em></p>
          <p class="text-gray-200">{{ comment.text }}</p>
        </li>
      </ul>

      <!-- Sin comentarios -->
      <p v-else class="text-gray-400 italic">No hay comentarios aún.</p>
    </div>

    <!-- Formulario para agregar comentario -->
    <form
      @submit.prevent="addComment"
      class="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 space-y-4"
    >
      <h3 class="text-xl font-semibold text-white mb-2">Añadir Comentario</h3>

      <div>
        <label for="comment" class="block text-gray-300 font-medium mb-2">
          Escribe tu comentario:
        </label>
        <textarea
          id="comment"
          v-model="newComment"
          class="bg-gray-900 text-white w-full p-4 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          rows="4"
          placeholder="Escribe aquí tu comentario..."
        ></textarea>
      </div>

      <BaseButton
        type="submit"
        :disabled="isAdding"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
      >
        {{ isAdding ? "Añadiendo comentario..." : "Enviar" }}
      </BaseButton>
    </form>

    <!-- Mensaje de feedback -->
    <p
      v-if="feedbackMessage"
      class="bg-green-600 text-white text-center py-3 mt-6 rounded-xl shadow-lg font-semibold"
    >
      {{ feedbackMessage }}
    </p>
  </div>
</template>
