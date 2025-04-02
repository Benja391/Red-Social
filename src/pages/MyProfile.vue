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
  <section class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <BaseHeading1 class="text-center mb-6">Mi Perfil</BaseHeading1>
      
      <!-- Información del usuario -->
      <div class="mb-6">
        <p><strong>Nombre:</strong> {{ userName }}</p>
        <p><strong>Correo:</strong> {{ userEmail }}</p>
      </div>
      
      <!-- Foto de Perfil -->
      <h2 class="text-xl font-semibold mb-2">Foto de perfil:</h2>
      <div class="mb-6">
        <img :src="profileImageUrl" alt="Imagen de perfil" class="w-32 h-32 rounded-full mb-4" v-if="profileImageUrl" />
        <input type="file" @change="handleProfileImageChange" class="mb-4" />
        <BaseButton @click="uploadProfileImage" :disabled="isUploadingProfileImage">
          <span v-if="isUploadingProfileImage">Subiendo...</span>
          <span v-else>Subir Imagen de Perfil</span>
        </BaseButton>
      </div>
      <p v-if="profileImageMessage" :class="{'text-green-500': profileImageMessage.includes('éxito'), 'text-red-500': !profileImageMessage.includes('éxito')}" class="text-center mb-6">
        {{ profileImageMessage }}
      </p>
    </div>
  </section>
</template>
