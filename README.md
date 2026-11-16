# 🧑‍🤝‍🧑 DV Social: Red Social

Red social web con publicaciones, perfiles y un chat público en tiempo real, construida con **Vue 3** y **Firebase**.

**🔗 Demo en vivo:** https://red-social-chat.netlify.app

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?logo=vuedotjs&logoColor=4FC08D) ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

---

## 🧩 Funcionalidades

- **Autenticación:** registro, inicio y cierre de sesión con Firebase Authentication.
- **Publicaciones:** crear, editar y ver posts, con una página de detalle para cada uno.
- **Perfiles:** perfil propio editable y perfiles públicos de otros usuarios.
- **Chat en tiempo real:** conversación pública que se actualiza al instante con Firestore.
- **Rutas protegidas:** las secciones privadas requieren iniciar sesión (Vue Router).
- **Diseño responsive** con Tailwind CSS.

## 🛠️ Tecnologías

| Área | Herramientas |
|---|---|
| Frontend | Vue 3, Vue Router, Tailwind CSS |
| Backend como servicio | Firebase Authentication, Cloud Firestore, Storage |
| Tooling | Vite, JavaScript (ES6+) |

## 🗂️ Estructura

```
src/
├── components/   Componentes reutilizables (botones, títulos, inputs)
├── pages/        Pantallas: Home, Login, Register, Chat, posts y perfiles
├── router/       Definición de rutas y protección de rutas privadas
└── services/     Acceso a Firebase (auth, usuarios, posts, chat)
```

Las reglas de seguridad de Firestore y Storage están documentadas en `reglas-firestore.txt` y `reglas-storage.txt`.

## ⚙️ Instalación

```bash
git clone https://github.com/Benja391/Red-Social.git
cd Red-Social
npm install
npm run dev
```

La configuración de Firebase se lee de variables de entorno. Copiá `.env.example` como `.env` y completalo con los datos de tu proyecto de Firebase. Si lo publicás en Vercel o Netlify, cargá esas mismas variables en la configuración del sitio.

## 👤 Autor

**Benjamín Bosch**, desarrollador Full Stack · [GitHub](https://github.com/Benja391) · [LinkedIn](https://www.linkedin.com/in/benjamin-bosch-/)
