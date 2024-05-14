<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="text-center mb-4">Welcome to WeatherTrack</h2>
        <div class="alert alert-danger" v-if="loginError">
          {{ loginError }}
        </div>
        <h1 class="text-center mb-4">Login</h1>
        <form @submit.prevent="loginForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" class="form-control">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" class="form-control">
          </div>
          <button type="submit" class="btn btn-primary btn-block mt-2">Login</button>
        </form>
        <p class="text-center mt-3">Don't have an account?</p>
        <p class="text-center mt-3"><router-link to="/register">Register here</router-link></p>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      username: "",
      password: "",
      loginError: null
    };
  },
  name: 'Login',
  computed: {
    ...mapGetters('authModule', ['isAuthenticated'])
  },
  beforeMount() {
    if (this.isAuthenticated) {
      this.$router.push('/')
    }
  },
  methods: {
    ...mapActions('authModule', ['login']),
    async loginForm() {
      try {
        const response = await this.login({ username: this.username, password: this.password })
        if (response.data.token) {
          this.$router.push('/home')
        } else {
          console.error('Login response missing token')
          this.loginError = 'Login response missing token'
        }
      } catch (error) {
        console.error('Login error:', error)
        this.loginError = 'Login error: invalid credentials'
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding-top: 1rem;
}

h1, h2 {
  color: #007bff;
  font-weight: bold;
}

.form-group label {
  font-weight: bold;
  color: #007bff;
}

.form-control {
  border-color: #ced4da;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>