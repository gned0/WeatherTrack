<template>
    <div class="forbidden">
      <h1>Forbidden</h1>
      <p>You are trying to access a forbidden section.</p>
      <button @click="redirectToHome">Go to Home</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      redirectToHome() {
        this.$router.push("/");
      },
    },
  };
  </script>
  
  <style scoped>
  .forbidden {
    text-align: center;
    margin-top: 100px;
  }
  </style>
  