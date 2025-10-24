<template >
  <div class="max-w-3xl mx-auto mt-4    mb-16 px-6">
    <h1 class="text-center text-4xl font-extrabold text-white mb-10 tracking-wide">
      Publicaciones
    </h1>

    <!-- Loader -->
    <div v-if="loading" class="text-center">
      <Loader />
    </div>

    <!-- Contenido -->
    <div v-else class="space-y-6">
      <div
        v-for="post in posts"
        :key="post.id"
        class="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
      >
        <!-- Feedback de acción -->
        <div
          v-if="post.feedback"
          class="w-full bg-green-600 text-white text-center py-2 font-semibold uppercase tracking-wide"
        >
          {{ post.feedback }}
        </div>

        <!-- Imagen de la publicación -->
        <img
          :src="post.imageUrl"
          alt="Imagen de la publicación"
          class="w-full h-64 object-cover"
        />

        <!-- Contenido de texto -->
        <div class="p-5 space-y-3">
          <p class="text-gray-300 text-sm">
            <strong class="text-blue-400">Publicado por:</strong> {{ post.userEmail }}
          </p>
          <p class="text-gray-100 leading-relaxed">{{ post.description }}</p>

          <!-- Comentarios -->
          <div
            v-if="post.comments && post.comments.length > 0"
            class="mt-4 bg-gray-900 p-4 rounded-lg border border-gray-700"
          >
            <h3 class="text-blue-400 text-lg font-semibold mb-3">Comentarios</h3>
            <div
              v-for="(comment, index) in post.comments"
              :key="index"
              class="mb-2 bg-gray-800 p-3 rounded-md"
            >
              <p class="text-sm text-gray-300 mb-1">
                <strong class="text-blue-400">{{ comment.userEmail }}:</strong>
              </p>
              <p class="text-gray-200">{{ comment.text }}</p>
            </div>
          </div>

          <!-- Enlace a detalles -->
          <div class="mt-4 text-center">
            <router-link
              :to="`/post/${post.id}`"
              class="text-blue-500 hover:text-blue-400 font-semibold hover:underline transition"
            >
              Ver más comentarios
            </router-link>
          </div>

          <!-- Botones de admin -->
          <div
            v-if="isAdmin"
            class="flex flex-wrap justify-center gap-4 mt-6 border-t border-gray-700 pt-4"
          >
            <button
              @click="editPost(post.id)"
              class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-5 rounded-xl shadow-md transition duration-200"
            >
              Editar
            </button>

            <button
              @click="deletePost(post.id)"
              :disabled="post.isDeleting"
              class="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2 px-5 rounded-xl shadow-md transition duration-200"
            >
              {{ post.isDeleting ? "Eliminando..." : "Eliminar" }}
            </button>
          </div>
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
