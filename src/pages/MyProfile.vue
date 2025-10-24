<script>
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";
import MainInput from '../components/MainInput.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseHeading1 from '../components/BaseHeading1.vue';

export default {
  name: 'UserProfile',
  components: {
    MainInput, BaseButton, BaseHeading1,
  },
  data() {
    return {
      user: null,
      userName: '',
      userEmail: '',
      profileImageUrl: '',
      profileImage: null,
      profileImageMessage: '',
      isUploadingProfileImage: false,
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        this.userEmail = user.email;
        await this.loadUserProfile(user.uid);
      } else {
        console.error("Usuario no autenticado");
      }
    });
  },
  methods: {
    async loadUserProfile(uid) {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.userName = userData.name || '';
          this.profileImageUrl = userData.profileImageUrl || '';
        }
      } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
      }
    },
    handleProfileImageChange(event) {
      this.profileImage = event.target.files[0];
    },
    async uploadProfileImage() {
      this.profileImageMessage = '';
      this.isUploadingProfileImage = true;
      try {
        const storageRef = ref(storage, `profileImages/${this.user.uid}/profile.jpg`);
        await uploadBytes(storageRef, this.profileImage);
        const downloadURL = await getDownloadURL(storageRef);
        await updateDoc(doc(db, "users", this.user.uid), { profileImageUrl: downloadURL });
        this.profileImageUrl = downloadURL;
        this.profileImage = null;
        this.profileImageMessage = "¡Foto de perfil actualizada con éxito!";
      } catch (error) {
        this.profileImageMessage = "Error al actualizar la foto de perfil.";
        console.error('Error al subir la imagen de perfil:', error);
      } finally {
        this.isUploadingProfileImage = false;
        setTimeout(() => {
          this.profileImageMessage = '';
        }, 3000);
      }
    },
  }
};
</script>

<template>
  <div class="max-w-lg mx-auto mt-4  mb-16 px-6">
    <!-- Título principal -->
    <h1 class="text-center text-4xl font-extrabold text-white mb-10 tracking-wide">
      Mi Perfil
    </h1>

    <!-- Contenedor principal -->
    <div class="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-lg">
      <!-- Información del usuario -->
      <div class="bg-gray-900 p-5 rounded-xl border border-gray-700 mb-8">
        <p class="text-gray-300 mb-2">
          <strong class="text-blue-400">Nombre:</strong> {{ userName }}
        </p>
        <p class="text-gray-300">
          <strong class="text-blue-400">Correo:</strong> {{ userEmail }}
        </p>
      </div>

      <!-- Foto de Perfil -->
      <div class="text-center">
        <h2 class="text-2xl font-semibold text-white mb-4">Foto de Perfil</h2>

        <!-- Imagen actual -->
        <div class="flex flex-col items-center mb-6">
          <img
            v-if="profileImageUrl"
            :src="profileImageUrl"
            alt="Imagen de perfil"
            class="w-36 h-36 rounded-full object-cover border-4 border-blue-500 shadow-md mb-4 transition-all hover:scale-105"
          />
          <div
            v-else
            class="w-36 h-36 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-gray-400 mb-4"
          >
            Sin imagen
          </div>

          <!-- Input de imagen -->
          <input
            type="file"
            @change="handleProfileImageChange"
            class="text-gray-300 bg-gray-900 border border-blue-400 rounded-lg p-2 w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition"
          />
        </div>

        <!-- Botón de subir -->
        <BaseButton
          @click="uploadProfileImage"
          :disabled="isUploadingProfileImage"
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
        >
          <span v-if="isUploadingProfileImage">Subiendo...</span>
          <span v-else>Subir Imagen de Perfil</span>
        </BaseButton>
      </div>

      <!-- Mensaje de feedback -->
      <p
        v-if="profileImageMessage"
        class="text-center mt-6 font-semibold"
        :class="{
          'text-green-500': profileImageMessage.includes('éxito'),
          'text-red-500': !profileImageMessage.includes('éxito')
        }"
      >
        {{ profileImageMessage }}
      </p>
    </div>
  </div>
</template>
