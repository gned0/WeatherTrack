<template>
  <div v-if="showNotification" class="notification">
    <div>
      <p>{{ notificationMessage }}</p>
      <button @click="closeNotification">Close</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { jwtDecode } from "jwt-decode";

export default {
  computed: {
    ...mapGetters(["getNotificationSocket"]),
    userid() {
      const token = this.$store.state.authModule.token;
      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        return userId;
      }
      return null;
    },
  },
  mounted() {
    this.getNotificationSocket.on("newAnomaly", (anomaly) => {
      if (anomaly.userid === this.userid) {
        console.log("New anomaly received for the current user:", anomaly);
        this.notificationMessage =
          "Alert! Weather anomaly detected: " +
          anomaly.attribute +
          " " +
          anomaly.value +
          ", " +
          this.$filters.formatTimestamp(anomaly.timestamp) +
          " in " +
          anomaly.location +
          ".";
        this.showNotification = true;

        setTimeout(() => {
          this.showNotification = false;
        }, 5000);
      } else {
        console.log("New anomaly received for a different user:", anomaly);
      }
    });
  },
  methods: {
    closeNotification() {
      this.showNotification = false;
    },
  },
  data() {
    return {
      notificationMessage: "",
      showNotification: false,
    };
  },
};
</script>

<style scoped>
.notification {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  padding: 4rem;
  background-color: #fff;
}
</style>
