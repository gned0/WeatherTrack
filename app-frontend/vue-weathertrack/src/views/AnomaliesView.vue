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
                  <td>{{ anomaly.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else-if="noAnomaliesMessage" class="alert alert-info">
            {{ noAnomaliesMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      anomalies: [],
      locations: [],
      selectedLocation: "",
      selectedAttribute: "",
      noAnomaliesMessage: "",
    };
  },
  mounted() {
    this.fetchLocations();
    this.fetchAnomalies();
  },
  methods: {
    async fetchAnomalies() {
      try {
        const response = await api.get("/anomalies", {
          params: {
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
