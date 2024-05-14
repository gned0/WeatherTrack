<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top w-100" v-if="isAuthenticated">
    <div class="container">
      <router-link to="/" class="navbar-brand">WeatherTrack</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/map" class="nav-link" @click="toggleNavbar">Map</router-link>
          </li>  
          <li class="nav-item">
            <router-link to="/data-display" class="nav-link" @click="toggleNavbar">Data</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/anomalies" class="nav-link" @click="toggleNavbar">Anomalies</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/users" class="nav-link" @click="toggleNavbar">Manage users</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/requests" class="nav-link" @click="toggleNavbar">Manage requests</router-link>
          </li>
          <li class="nav-item" v-if="!isAdmin">
            <router-link to="/requests-me" class="nav-link" @click="toggleNavbar">User requests</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link" @click="toggleNavbar">Profile</router-link>
          </li>
          <li class="nav-item">
            <button class="nav-link btn btn-link text-light" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Navbar',
  computed: {
    ...mapGetters('authModule', ['isAuthenticated', 'isAdmin'])
  },
  methods: {
    logout() {
      this.$store.dispatch('authModule/logout');
      this.$router.push('/login');
    },
    toggleNavbar() {
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      } else {
        navbarCollapse.classList.add('show');
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-weight: bold;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #007bff !important;
}

.btn-link {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.btn-link:hover {
  color: #007bff !important;
}
</style>