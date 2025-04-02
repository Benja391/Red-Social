<script>
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../services/firebase";
import { createPost } from "../services/posts";
import { getAuth } from "firebase/auth";
import BaseButton from '../components/BaseButton.vue';

export default {
  components: { BaseButton },
  data() {
    return {
      title: "",
      description: "",
      file: null,
      authUser: null,
      successMessage: "", // Estado para el mensaje de éxito
      errorMessage: "", 
      isLoading: false,  // Estado para el mensaje de error
    };
  },
  mounted() {
    const auth = getAuth();
    auth.onAuthStateChanged(user => {
      if (user) {
        this.authUser = user;
      }
    });
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async createPost() {
      if (!this.authUser) {
        console.error("User not authenticated");
        this.errorMessage = "No estás autenticado";
        return;
      }

      this.isLoading = true;

      if (!this.file) {
        console.error("No file selected");
        this.errorMessage = "Selecciona un archivo para subir.";
        return;
      }

      try {
        const storageRef = ref(storage, `posts/${this.file.name}`);
        await uploadBytes(storageRef, this.file);
        const imageUrl = await getDownloadURL(storageRef);

        // Agregar la fecha actual como 'createdAt'
        const postData = {
          title: this.title,
          description: this.description,
          imageUrl,
          userEmail: this.authUser.email,
          createdAt: new Date(),  // Aquí se agrega la fecha y hora actual
        };

        await createPost(postData);

        // Mensaje de éxito
        console.log("Post creado");
        this.successMessage = "¡Post creado con éxito!";
        this.errorMessage = ""; // Limpiar mensaje de error si lo hubo

        // Redirigir después de mostrar el mensaje de éxito
        setTimeout(() => {
          this.$router.push("/perfil");
        }, 2000); // 2 segundos de delay antes de redirigir

      } catch (error) {
        console.error("Error creating post:", error);
        this.errorMessage = "Error al crear el post.";
      }
    },
  },
};
</script>

<template>
   <h1 class="text-center text-3xl font-bold text-white mb-6">Crear posteo</h1>
  <div class="max-w-md mx-auto mt-10">
    <!-- Mensaje de éxito -->
    <div v-if="successMessage" class="p-4 mb-4 text-green-700 bg-green-100 border border-green-500 rounded">
      {{ successMessage }}
    </div>

    <!-- Mensaje de error -->
    <div v-if="errorMessage" class="p-4 mb-4 text-red-700 bg-red-100 border border-red-500 rounded">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="createPost" class="space-y-4">
      <div>
        <input
          v-model="title"
          placeholder="Título"
          class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          style="background-color: #616160;"
        />
      </div>
      <div>
        <textarea
          v-model="description"
          placeholder="Descripción"
          rows="4"
          class="w-full p-2 border border-gray-300 rounded-md"
          style="background-color: #616160;"
        ></textarea>
      </div>
      <div>
        <input
          type="file"
          @change="onFileChange"
          class="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <BaseButton :disabled="isLoading" type="submit">
  {{ isLoading ? "Creando posteo..." : "Crear Posteo" }}
</BaseButton>
      </div>
    </form>
  </div>
</template>
