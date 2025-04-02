import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
  } from "firebase/auth";
  import { doc, getDoc } from "firebase/firestore"; // Importar métodos de Firestore
  import { auth, db } from "./firebase"; // Asegúrate de tener tu instancia de Firestore
  import { createUserProfile } from "./user-profile";
  
  const AUTH_EMPTY_STATE = {
    id: null,
    email: null,
    role: null, // Ahora incluimos el rol
  };
  
  let authUser = AUTH_EMPTY_STATE;
  let observers = [];
  
  if (localStorage.getItem("user")) {
    authUser = JSON.parse(localStorage.getItem("user"));
  }
  
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Verificar el rol del usuario en Firestore
      const role = await fetchUserRole(user.uid);
  
      authUser = {
        id: user.uid,
        email: user.email,
        role, // Guardar el rol en el estado
      };
  
      localStorage.setItem("user", JSON.stringify(authUser));
    } else {
      authUser = AUTH_EMPTY_STATE;
      localStorage.removeItem("user");
    }
    notifyAll(); // Notifica a todos los observadores
  });
  
  /**
   * Verifica el rol del usuario en Firestore
   * @param {string} uid - UID del usuario autenticado
   * @returns {Promise<string | null>} - Rol del usuario (e.g., "admin", "user") o null si no tiene rol
   */
  async function fetchUserRole(uid) {
    try {
      const docRef = doc(db, "roles", uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return docSnap.data().rol || null; // Devuelve el rol si existe
      } else {
        console.warn("No se encontró rol para este usuario.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
      return null;
    }
  }
  
  /**
   * Registra un nuevo usuario y crea su perfil
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{id: string, email: string}>}
   */
  export async function register(email, password) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
  
      await createUserProfile(userCredentials.user.uid, { email: userCredentials.user.email });
  
      console.log("Usuario creado: ", userCredentials);
      return {
        id: userCredentials.user.uid,
        email: userCredentials.user.email,
      };
    } catch (error) {
      console.error("[auth.js register] Error al crear el usuario ", error);
      throw error;
    }
  }
  
  /**
   * Inicia sesión con un usuario existente
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{id: string, email: string, role: string | null}>}
   */
  export async function login(email, password) {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
  
      const role = await fetchUserRole(user.uid); // Obtener el rol al iniciar sesión
      console.log("Usuario autenticado: ", user, "Rol:", role);
  
      authUser = {
        id: user.uid,
        email: user.email,
        role,
      };
  
      return {
        id: user.uid,
        email: user.email,
        role,
      };
    } catch (error) {
      console.error("[auth.js login] Error al iniciar sesión: ", error);
      throw error;
    }
  }
  
  /**
   * Cierra la sesión del usuario actual
   * @returns {Promise<void>}
   */
  export function logout() {
    return signOut(auth);
  }
  
  /**
   * Suscribe un observador para recibir actualizaciones de authUser
   * @param {(user) => void} callback
   * @returns {() => void}
   */
  export function subscribeToAuth(callback) {
    observers.push(callback);
    console.log("Observer para auth agregado. El stack es:", observers);
    notify(callback);
    return () => (observers = observers.filter((obs) => obs !== callback));
  }
  
  /**
   * Notifica un observador individual con los datos actuales
   * @param {(user) => void} observer
   */
  function notify(observer) {
    observer({ ...authUser });
  }
  
  /**
   * Notifica a todos los observadores
   */
  function notifyAll() {
    observers.forEach((obs) => notify(obs));
  }
  