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
  <div>
    <h1 class="text-2xl">{{ post.title }}</h1>
    <p><strong>Creado por: {{ post.userEmail }}</strong></p>
    <img :src="post.imageUrl" alt="Post image" />

    <h2>Comentarios:</h2>
    <ul>
      <li v-for="comment in comments" :key="comment.id">
        <p><em>{{ comment.author }}: </em></p>
        <p>{{ comment.text }}</p>
      </li>
    </ul>

    <form @submit.prevent="addComment">
      <div>
        <label for="comment">Añadir Comentario:</label>
        <textarea
          class="bg-[#616160] w-full p-4 border border-[#83B1DF] rounded"
          id="comment"
          v-model="newComment"
        ></textarea>
      </div>
      <BaseButton type="submit" :disabled="isAdding">
        {{ isAdding ? "Añadiendo comentario..." : "Enviar" }}
      </BaseButton>
    </form>

    <!-- Mensaje de feedback -->
    <p v-if="feedbackMessage" class="bg-green-500 text-white text-center py-2 mt-4 rounded shadow">
      {{ feedbackMessage }}
    </p>
  </div>
</template>
