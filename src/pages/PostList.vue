<template>
  <div class="max-w-2xl mx-auto mt-10">
    <h1 class="text-center text-3xl font-bold text-white mb-6">Publicaciones</h1>

    <div v-if="loading" class="text-center"><Loader /></div>

    <div v-else class="space-y-4">
      <div v-for="post in posts" :key="post.id" class="border p-4 rounded relative">
        <!-- Mensaje de feedback para esta publicación -->
        <div
          v-if="post.feedback"
          class=" w-full bg-green-600 text-white text-center py-2 font-semibold"
        >
          {{ post.feedback }}
        </div>

        <img :src="post.imageUrl" alt="Imagen de la publicación" class="w-full h-auto mb-2" />
        <p><strong>Publicado por: {{ post.userEmail }}</strong></p>
        <p>{{ post.description }}</p>

        <!-- Mostrar los comentarios -->
        <div v-if="post.comments && post.comments.length > 0" class="mt-4">
          <h3 class="text-white text-lg">Comentarios:</h3>
          <div v-for="(comment, index) in post.comments" :key="index" class="mb-2 p-2 bg-gray-700 rounded-md">
            <p><strong>{{ comment.userEmail }}:</strong></p>
            <p>{{ comment.text }}</p>
          </div>
        </div>

        <!-- Enlace a la página de detalles de la publicación con comentarios -->
        <p>
          <router-link :to="`/post/${post.id}`" class="text-blue-500 hover:underline">Ver más comentarios</router-link>
        </p>

        <!-- Botones solo visibles si el usuario es admin -->
        <div v-if="isAdmin" class="flex space-x-4 mt-4">
          <button
            @click="editPost(post.id)"
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
          >
            Editar
          </button>
          <button
            @click="deletePost(post.id)"
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
            :disabled="post.isDeleting"
          >
            {{ post.isDeleting ? "Eliminando..." : "Eliminar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { auth } from "../services/firebase";

export default {
  data() {
    return {
      posts: [],
      loading: true,
      isAdmin: false,
    };
  },
  async created() {
    // Obtener los posts de Firestore
    const querySnapshot = await getDocs(collection(db, "posts"));
    this.posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      isDeleting: false, // Estado de carga por publicación
      feedback: null, // Feedback específico para cada publicación
    }));
    this.loading = false;

    // Verificar si el usuario está autenticado y si es admin
    const user = auth.currentUser;
    if (user) {
      const role = await this.fetchUserRole(user.uid);
      this.isAdmin = role === "admin";
    }
  },
  methods: {
    async fetchUserRole(userId) {
      try {
        const roleDocRef = doc(db, "roles", userId);
        const roleDoc = await getDoc(roleDocRef);

        if (roleDoc.exists()) {
          const roleData = roleDoc.data();
          return roleData.rol;
        } else {
          return "user";
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        return "user";
      }
    },
    async editPost(postId) {
      this.$router.push(`/edit-post/${postId}`);
    },
    async deletePost(postId) {
      const postIndex = this.posts.findIndex((post) => post.id === postId);

      if (postIndex !== -1) {
        try {
          this.posts[postIndex].isDeleting = true; // Activar estado de carga

          // Simulación de carga prolongada (3 segundos antes de eliminar en Firestore)
          await new Promise((resolve) => setTimeout(resolve, 1000));

          await deleteDoc(doc(db, "posts", postId)); // Eliminar publicación de Firestore
          this.posts[postIndex].feedback = "Publicación eliminada con éxito"; // Mensaje de feedback

          // Mantener el feedback visible durante más tiempo (5 segundos antes de eliminar del DOM)
          setTimeout(() => {
            this.posts.splice(postIndex, 1); // Eliminar publicación de la lista
          }, 2000);
        } catch (error) {
          console.error("Error al eliminar la publicación:", error);
        } finally {
          this.posts[postIndex].isDeleting = false; // Desactivar estado de carga
        }
      }
    },
  },
};
</script>
