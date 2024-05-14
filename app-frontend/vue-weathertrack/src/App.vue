<script setup>
import Navbar from "@/components/Navbar.vue"
import Notification from '@/components/Notification.vue';

</script>

<template>
  <Notification></Notification>
  <Navbar></Navbar>
  <RouterView></RouterView>
</template>
