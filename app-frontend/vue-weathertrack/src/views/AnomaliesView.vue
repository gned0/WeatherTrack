<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="text-center mb-4">Anomalies</h1>
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="location" class="form-label">Location:</label>
            <select
              id="location"
              v-model="selectedLocation"
              class="form-select"
              @change="fetchAnomalies"
            >
              <option value="">All Locations</option>
              <option
                v-for="location in locations"
                :key="location"
                :value="location"
              >
                {{ location }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="attribute" class="form-label">Attribute:</label>
            <select
              id="attribute"
              v-model="selectedAttribute"
              class="form-select"
              @change="fetchAnomalies"
            >
              <option value="">All Attributes</option>
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="wind_speed">Wind Speed</option>
            </select>
          </div>
        </div>
        <div class="d-flex justify-content-center">
          <div v-if="anomalies.length > 0">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Location</th>
                  <th>Attribute</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="anomaly in anomalies" :key="anomaly._id">
                  <td>{{ $filters.formatTimestamp(anomaly.timestamp) }}</td>
                  <td>{{ anomaly.location }}</td>
                  <td>{{ formatAttribute(anomaly.attribute) }}</td>
                  <td>{{ anomaly.value.toFixed(1) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else-if="noAnomaliesMessage" class="alert alert-info">
            {{ noAnomaliesMessage }}
          </div>
        </div>
        <hr class="my-5" />

        <h2 class="text-center mb-4">Notifications</h2>
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="new-location" class="form-label">Location:</label>
            <select
              id="new-location"
              v-model="newNotification.location"
              class="form-select"
            >
              <option value="">Select Location</option>
              <option
                v-for="location in locations"
                :key="location"
                :value="location"
              >
                {{ location }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="new-attribute" class="form-label">Attribute:</label>
            <select
              id="new-attribute"
              v-model="newNotification.attribute"
              class="form-select"
            >
              <option value="">Select Attribute</option>
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="wind_speed">Wind Speed</option>
            </select>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="new-operand" class="form-label">Operand:</label>
            <select
              id="new-operand"
              v-model="newNotification.operand"
              class="form-select"
            >
              <option value="">Select Operand</option>
              <option value="gt">Greater Than</option>
              <option value="lt">Less Than</option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="new-threshold" class="form-label">Threshold:</label>
            <input
              id="new-threshold"
              v-model.number="newNotification.threshold"
              type="number"
              class="form-control"
              placeholder="Enter threshold"
            />
          </div>
        </div>
        <div class="d-flex justify-content-center mb-4">
          <button
            class="btn btn-primary mx-2"
            @click="createNotification"
            :disabled="!canCreateNotification"
          >
            Create Notification
          </button>
        </div>
        <div v-if="notifications.length > 0">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Location</th>
                <th>Attribute</th>
                <th>Operand</th>
                <th>Threshold</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="notification in notifications" :key="notification._id">
                <td>{{ notification.location }}</td>
                <td>{{ formatAttribute(notification.attribute) }}</td>
                <td>{{ formatOperand(notification.operand) }}</td>
                <td>{{ notification.threshold }}</td>
                <td>
                  <button
                    class="btn btn-primary btn-sm mx-1"
                    @click="editNotification(notification)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-danger btn-sm mx-1"
                    @click="deleteNotification(notification)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="alert alert-info">No notifications found</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api";
import { jwtDecode } from "jwt-decode";

export default {
  data() {
    return {
      anomalies: [],
      locations: [],
      selectedLocation: "",
      selectedAttribute: "",
      noAnomaliesMessage: "",
      notifications: [],
      newNotification: {
        location: "",
        attribute: "",
        operand: "",
        threshold: null,
      },
    };
  },
  mounted() {
    this.fetchLocations();
    this.fetchAnomalies();
    this.fetchNotifications();
  },
  computed: {
    canCreateNotification() {
      const { location, attribute, operand, threshold } = this.newNotification;
      return (
        location && attribute && operand && threshold !== null && threshold !== ""
      );
    },
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
  methods: {
    async fetchAnomalies() {
      try {
        const response = await api.get("/anomalies", {
          params: {
            userid: this.userid,
            location: this.selectedLocation,
            attribute: this.selectedAttribute,
          },
        });
        this.anomalies = response.data;
        this.noAnomaliesMessage = "";
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.anomalies = [];
          this.noAnomaliesMessage = "No anomalies found for these parameters";
        } else {
          console.error("Error fetching anomalies:", error);
        }
      }
    },
    async fetchLocations() {
      try {
        const response = await api.get("/locations");
        this.locations = response.data.locations;
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    },
    formatAttribute(attribute) {
      return attribute
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    },
    formatOperand(operand) {
      return operand === "gt" ? "Greater Than" : "Less Than";
    },
    async fetchNotifications() {
      try {
        const response = await api.get("/notifications", {
          params: {
            userid: this.userid,
          },
        });
        this.notifications = response.data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },
    async createNotification() {
      try {
        const response = await api.post(
          "/notifications",
          {
            ...this.newNotification,
            userid: this.userid,
          }
        );
        this.fetchNotifications();
        this.resetNewNotification();
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    },
    editNotification(notification) {
      this.newNotification = { ...notification };
    },
    async deleteNotification(notification) {
      try {
        await api.delete(`/notifications/${notification._id}`, {
          params: {
            userid: this.userid,
          },
        });
        this.notifications = this.notifications.filter(
          (n) => n._id !== notification._id
        );
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    },
    resetNewNotification() {
      this.newNotification = {
        location: "",
        attribute: "",
        operand: "",
        threshold: null,
      };
    },
  },
};
</script>

<style scoped>
.container {
  padding-top: 4rem;
}

h1 {
  color: #007bff;
  font-weight: bold;
}

.form-select {
  border-color: #ced4da;
  transition: border-color 0.3s ease;
}

.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 0.25rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table thead th {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  color: #007bff;
  font-weight: bold;
}

.table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.table tbody tr:hover {
  background-color: #e9ecef;
}
</style>
