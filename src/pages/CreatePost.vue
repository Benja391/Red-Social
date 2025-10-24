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
  <div class="max-w-lg mx-auto mt-4  mb-16 px-6">
    <!-- Título principal -->
    <h1 class="text-center text-4xl font-extrabold text-white mb-10 tracking-wide">
      Crear Posteo
    </h1>

    <!-- Mensaje de éxito -->
    <div
      v-if="successMessage"
      class="p-4 mb-4 bg-green-600 text-white text-center rounded-xl shadow-md font-semibold"
    >
      {{ successMessage }}
    </div>

    <!-- Mensaje de error -->
    <div
      v-if="errorMessage"
      class="p-4 mb-4 bg-red-600 text-white text-center rounded-xl shadow-md font-semibold"
    >
      {{ errorMessage }}
    </div>

    <!-- Formulario -->
    <form
      @submit.prevent="createPost"
      class="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 space-y-6"
    >
      <!-- Campo título -->
      <div>
        <label class="block text-gray-300 font-medium mb-2">Título</label>
        <input
          v-model="title"
          placeholder="Escribí el título del posteo..."
          class="w-full p-3 bg-gray-900 text-white border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      <!-- Campo descripción -->
      <div>
        <label class="block text-gray-300 font-medium mb-2">Descripción</label>
        <textarea
          v-model="description"
          placeholder="Agregá una descripción..."
          rows="4"
          class="w-full p-3 bg-gray-900 text-white border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
        ></textarea>
      </div>

      <!-- Subir imagen -->
      <div>
        <label class="block text-gray-300 font-medium mb-2">Imagen del post</label>
        <input
          type="file"
          @change="onFileChange"
          class="w-full text-gray-200 bg-gray-900 border border-blue-400 rounded-lg cursor-pointer p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition"
        />
      </div>

      <!-- Botón -->
      <div class="text-center mt-6">
        <BaseButton
          :disabled="isLoading"
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
        >
          {{ isLoading ? "Creando posteo..." : "Crear Posteo" }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>
