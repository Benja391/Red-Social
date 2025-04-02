import Home from '../pages/Home.vue';
import Chat from '../pages/Chat.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import MyProfile from '../pages/MyProfile.vue';
import UserProfile from '../pages/UserProfile.vue';
import PostList from '../pages/PostList.vue';
import PostDetail from '../pages/PostDetail.vue';
import CreatePost from '../pages/CreatePost.vue';
import {createRouter,createWebHashHistory} from 'vue-router';
import { subscribeToAuth, } from '../services/auth';
import EditPost from '../pages/EditPost.vue';


const routes = [
    { path: '/',                    component: Home},
    { path: '/iniciar-sesion',      component: Login},
    { path: '/registro',            component: Register},
    { path: '/chat',                component: Chat,        meta:{ requiresAuth: true }},
    { path: '/perfil',              component: MyProfile,   meta:{ requiresAuth: true }},
    { path: '/usuario/:id',         component: UserProfile, meta:{ requiresAuth: true }},
    { path: '/posts', component: PostList },
    { path: '/post/:id', component: PostDetail },
    { path: '/create-post', component: CreatePost, meta: { requiresAuth: true } },
    { path: '/edit-post/:id', component: EditPost },
];

const router = createRouter ({

    routes,
    history: createWebHashHistory(),
});

let authUser = {
    id: null,
    email: null,
}

subscribeToAuth(newUserData => authUser = newUserData);

router.beforeEach((to, from,) => {
    console.log('Cambiamos a la ruta: ', to.path);

    if(authUser.id === null && to.meta.requiresAuth){

        return {
            path: '/iniciar-sesion',
        };
    }
});

export default router;
