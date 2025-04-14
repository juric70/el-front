import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
    },

    actions: {
        login(user, token) {
            this.user = user
            this.token = token
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },

        initializeFromLocalStorage() {
            const token = localStorage.getItem('token')
            const user = localStorage.getItem('user')
            if (token) {
                this.token = token
            }
            if (user) {
                this.user = JSON.parse(user)
            }
        }
    },
})
