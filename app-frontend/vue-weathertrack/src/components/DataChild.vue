<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">{{ location }}</h5>
      <div v-if="latestData">
        <p class="card-text">
          Latest update: {{ $filters.formatTimestamp(latestData.timestamp) }}
        </p>
        <p class="card-text">
          Temperature: {{ latestData.temperature.toFixed(1) }}°C
        </p>
        <p class="card-text">Humidity: {{ latestData.humidity.toFixed(1) }}%</p>
        <p class="card-text" v-if="latestData.wind_speed">
          Wind Speed: {{ latestData.wind_speed.toFixed(1) }} km/h
        </p>
        <p class="card-text" v-if="latestData.condition">
          Condition: {{ latestData.condition }}
        </p>
      </div>
      <div v-else>
        <p class="card-text">No data available</p>
      </div>
      <button class="btn btn-primary mr-2" @click="toggleShowMore24Hours">
        {{ showMore24Hours ? "Hide Last 24 Hours" : "Show Last 24 Hours" }}
      </button>
      <button class="btn btn-primary" @click="toggleShowHistorical">
        {{ showHistorical ? "Hide Historical Data" : "Show Historical Data" }}
      </button>
    </div>
    <DailyData v-if="showMore24Hours" :location="location" :data="latestData" />
    <HistoricalData v-if="showHistorical" :location="location" />
  </div>
</template>

<script>
import api from "../api";
import DailyData from "./DailyData.vue";
import HistoricalData from "./HistoricalData.vue";

export default {
  components: {
    DailyData,
    HistoricalData,
  },
  props: {
    location: {
      type: String,
      required: true,
    },
    dataSocket: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      latestData: null,
      showMore24Hours: false,
      showHistorical: false,
    };
  },
  mounted() {
    this.fetchLatestData();
    this.dataSocket.on("newData", (data) => {
      console.log("New data received for", this.location, ": ", data);
      this.latestData = data;
    });
  },
  methods: {
    async fetchLatestData() {
      try {
        const response = await api.get(
          `http://localhost:3000/data/latest?location=${this.location}`
        );
        this.latestData = response.data;
      } catch (error) {
        console.error("Error fetching latest data:", error);
      }
    },
    toggleShowMore24Hours() {
      this.showMore24Hours = !this.showMore24Hours;
      this.showHistorical = false;
    },
    toggleShowHistorical() {
      this.showHistorical = !this.showHistorical;
      this.showMore24Hours = false;
    },
  },
};
</script>

<style scoped>
.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-title {
  color: #007bff;
  font-weight: bold;
  margin-bottom: 1rem;
}

.card-text {
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.mr-2 {
  margin-bottom: 0.5rem;
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
</style>

