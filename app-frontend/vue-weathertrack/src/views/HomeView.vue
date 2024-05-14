<template>
  <div class="home">
    <div class="hero">
      <h1>Welcome to WeatherTrack</h1>
      <p>WeatherTrack is a service that aggregates real-time weather data from various sensors around the world and displays it to users, providing insights into weather trends.
         By registering, you can use WeatherTrack to view the data, receive real-time information about
          weather anomalies, and post requests for new sensors and features.</p>
      <button class="btn btn-primary" @click="goToDashboard">Go to Data Dashboard</button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      const token = localStorage.getItem('token');
      return token ? true : false;
    },
  },
  methods: {
    goToDashboard() {
      if (this.isAuthenticated) {
        this.$router.push('/data-display');
      } else {
        this.$router.push('/login');
      }
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.hero {
  max-width: 800px;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #007bff;
  margin-bottom: 1rem;
}

p {
  color: #6c757d;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>