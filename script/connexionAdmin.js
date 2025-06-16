const app = Vue.createApp({
data() {
    return {
    isRegister: true,
    message: '',
    registerForm: {
        name: '',
        email: '',
        password: '',
        phone: '',
        street: '',
        city: '',
        postal: '',
        country: '',
        terms: false
    },
    loginForm: {
        email: '',
        password: ''
    }
    }
},
methods: {
    submitRegister() {
    this.message = `Compte crée ${this.registerForm.name}!`;
    this.registerForm = { name: '', email: '', password: '', phone: '', street: '', city: '', postal: '', country: '', terms: false };
    },
    submitLogin() {
    this.message = `Connecté en tant que ${this.loginForm.email}!`;
    this.loginForm = { email: '', password: '' };
    }
}
});

app.mount('#app');
