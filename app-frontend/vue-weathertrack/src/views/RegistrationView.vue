<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="text-center mb-4">Welcome to WeatherTrack</h2>
        <div class="alert alert-danger" v-if="loginError">
          {{ loginError }}
        </div>
        <h1 class="text-center mb-4">Register</h1>
        <form @submit.prevent="register">
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary btn-block mt-2">Register</button>
        </form>
        <p class="text-center mt-3">Already registered? <router-link to="/login">Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      roles: [],
      loginError: null
    }
  },
  methods: {
    async register() {
      try {
        await api.post('http://localhost:3000/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password,
          roles: this.roles
        });
        this.$router.push('/login')
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.loginError = error.response.data.message; 
        } else {
          console.error(error);
          this.loginError = 'Registration error: please try again later'; 
        }
      }
    }
  }
}
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