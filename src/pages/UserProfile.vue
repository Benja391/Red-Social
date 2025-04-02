<script>


import { getUserProfileById } from '../services/user-profile';

export default {
    name: 'UserProfile',
    components: {},
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
            loadingUser: false,
        };
    },
    async mounted() {
        this.loadingUser = true;
        try {
            const UserId = this.$route.params.id;
            console.log(`Fetching profile for user ID: ${UserId}`);
            this.user = await getUserProfileById(UserId);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            this.loadingUser = false;
        }
    }
};
</script>

<template>
    <Loader v-if="loadingUser" />
    <template v-else>
        <p>Perfil de {{ user.email }}</p>
    </template>
</template>
