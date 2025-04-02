<template>
  <div class="max-w-2xl mx-auto mt-10">
    <h1 class="text-center text-3xl font-bold text-white mb-6">Editar Publicación</h1>
    <div v-if="loading" class="text-center"><Loader /></div>
    <div v-else>
      <form @submit.prevent="updatePost">
        <!-- Editar descripción -->
        <div class="mb-4">
          <label for="description" class="block text-white">Descripción</label>
          <textarea
            id="description"
            v-model="post.description"
            class="w-full p-2 border border-gray-300 rounded-md bg-gray-600 text-white"
            rows="4"
            required
          ></textarea>
          <p
            v-if="feedback.description"
            class="bg-green-500 text-white text-center py-2 rounded shadow-md mt-2"
          >
            {{ feedback.description }}
          </p>
        </div>

        <!-- Editar imagen -->
        <div class="mb-4">
          <label for="image" class="block text-white">Actualizar Imagen</label>
          <input
            type="file"
            id="image"
            @change="handleImageUpload"
            accept="image/*"
            class="w-full p-2 border border-gray-300 rounded-md bg-gray-600 text-white"
          />
          <p
            v-if="feedback.image"
            class="bg-green-500 text-white text-center py-2 rounded shadow-md mt-2"
          >
            {{ feedback.image }}
          </p>
        </div>

        <!-- Editar comentarios -->
        <div class="mb-4">
          <label class="block text-white">Editar Comentarios</label>
          <div v-for="(comment, index) in comments" :key="comment.id" class="mb-2">
            <textarea
              v-model="comments[index].text"
              class="w-full p-2 border border-gray-300 rounded-md bg-gray-600 text-white"
              rows="2"
            ></textarea>
          </div>
          <p
            v-if="feedback.comments"
            class="bg-green-500 text-white text-center py-2 rounded shadow-md mt-2"
          >
            {{ feedback.comments }}
          </p>
        </div>

        <!-- Botón de guardar -->
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md transition duration-200"
          :disabled="isSaving"
        >
          {{ isSaving ? "Guardando..." : "Guardar Cambios" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../services/firebase";
import { collection, query, where, getDocs, updateDoc as updateCommentDoc } from "firebase/firestore";

export default {
  data() {
    return {
      post: {
        id: "",
        description: "",
        imageUrl: "",
      },
      comments: [],
      loading: true,
      isSaving: false,
      newImageFile: null,
      feedback: {
        description: null,
        image: null,
        comments: null,
      },
      initialState: {}, // Para comparar cambios
    };
  },
  async created() {
    const postId = this.$route.params.id;

    // Cargar datos de la publicación
    const postDocRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postDocRef);
    if (postDoc.exists()) {
      this.post = { id: postDoc.id, ...postDoc.data() };
      this.initialState = JSON.parse(JSON.stringify(this.post)); // Guarda el estado inicial
    } else {
      console.log("Post no encontrado");
      this.$router.push("/posts"); // Redirige si no se encuentra el post
      return;
    }

    // Cargar comentarios asociados
    const commentsQuery = query(
      collection(db, "comments"),
      where("postId", "==", postId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    commentsSnapshot.forEach((doc) => {
      this.comments.push({ id: doc.id, ...doc.data() });
    });

    this.initialState.comments = JSON.parse(JSON.stringify(this.comments)); // Guarda el estado inicial de los comentarios
    this.loading = false;
  },
  methods: {
    async handleImageUpload(event) {
      this.newImageFile = event.target.files[0];
    },
    async updatePost() {
      this.isSaving = true; // Inicia el estado de carga
      const updates = {};

      try {
        // Verificar si la descripción cambió
        if (this.post.description !== this.initialState.description) {
          updates.description = this.post.description;
        }

        // Verificar si la imagen cambió
        if (this.newImageFile) {
          const imageRef = ref(storage, `posts/${this.post.id}`);
          await uploadBytes(imageRef, this.newImageFile);
          const updatedImageUrl = await getDownloadURL(imageRef);
          updates.imageUrl = updatedImageUrl;

          this.showFeedback("image", "Imagen actualizada con éxito");
         
        }

        // Actualizar datos en Firebase si hay cambios
        if (Object.keys(updates).length > 0) {
          const postRef = doc(db, "posts", this.post.id);
          await updateDoc(postRef, updates);
          if (updates.description) {
                    this.showFeedback("description", "Descripción actualizada con éxito");
          }
        }

        // Verificar si los comentarios cambiaron
        let commentsUpdated = false;
        for (const comment of this.comments) {
          const originalComment = this.initialState.comments?.find(
            (c) => c.id === comment.id
          );
          if (originalComment && originalComment.text !== comment.text) {
            const commentRef = doc(db, "comments", comment.id);
            await updateCommentDoc(commentRef, { text: comment.text });
            commentsUpdated = true;
          }
        }

        if (commentsUpdated) {
          this.showFeedback("comments", "Comentarios actualizados con éxito");
        }

        setTimeout(() => {
          this.$router.push("/posts"); // Redirige a PostList después de la edición
        }, 2000);
      } catch (error) {
        console.error("Error al actualizar la publicación o comentarios:", error);
      } finally {
        this.isSaving = false; // Termina el estado de carga
      }
    },
    showFeedback(field, message) {
      this.feedback[field] = message;
      setTimeout(() => {
        this.feedback[field] = null;
      }, 2000); // El mensaje desaparece después de 2 segundos
    },
  },
};
</script>
