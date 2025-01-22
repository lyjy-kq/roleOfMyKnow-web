
import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
    state: () => ({
        selectedRole: '需求工程师',
    }),
    actions: {
        setSelectedRole(role) {
            this.selectedRole = role;
        },
    },
});
