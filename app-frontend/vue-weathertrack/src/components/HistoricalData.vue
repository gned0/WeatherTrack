<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">{{ location }} - Last 24 Hours</h5>
      <canvas ref="chartRef"></canvas>
      <div v-if="insights">
        <p class="card-text">
          Max Temperature: {{ insights.maxTemperature.toFixed(1) }}°C
        </p>
        <p class="card-text">
          Min Temperature: {{ insights.minTemperature.toFixed(1) }}°C
        </p>
        <p class="card-text">
          Avg Temperature: {{ insights.avgTemperature.toFixed(1) }}°C
        </p>
        <p class="card-text">
          Max Humidity: {{ insights.maxHumidity.toFixed(1) }}%
        </p>
        <p class="card-text">
          Min Humidity: {{ insights.minHumidity.toFixed(1) }}%
        </p>
        <p class="card-text">
          Avg Humidity: {{ insights.avgHumidity.toFixed(1) }}%
        </p>
        <p class="card-text">
          Max Wind Speed: {{ insights.maxWindSpeed.toFixed(1) }} km/h
        </p>
        <p class="card-text">
          Min Wind Speed: {{ insights.minWindSpeed.toFixed(1) }} km/h
        </p>
        <p class="card-text">
          Avg Wind Speed: {{ insights.avgWindSpeed.toFixed(1) }} km/h
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { Line } from "vue-chartjs";
import { ref, watchEffect } from "vue";
import axios from "axios";
import "chartjs-adapter-date-fns";
import { Chart } from "chart.js/auto";
import api from "@/api";

export default {
  name: "DailyData",
  components: { Line },
  props: {
    location: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const chartRef = ref(null);
    const chartData = ref(null);
    let chartInstance = null;
    const insights = ref(null);
    const timespan = 24;
    const fetchInsights = async () => {
      try {
        const maxHumidityResponse = await api.get(
          `/data/max?location=${props.location}&attribute=humidity`
        );
        const minHumidityResponse = await api.get(
          `/data/min?location=${props.location}&attribute=humidity`
        );

        const avgHumidityResponse = await api.get(
          `/data/avg?location=${props.location}&attribute=humidity`
        );

        const maxTemperatureResponse = await api.get(
          `/data/max?location=${props.location}&attribute=temperature`
        );

        const minTemperatureResponse = await api.get(
          `/data/min?location=${props.location}&attribute=temperature`
        );

        const avgTemperatureResponse = await api.get(
          `/data/avg?location=${props.location}&attribute=temperature`
        );

        const maxWindSpeedResponse = await api.get(
          `/data/max?location=${props.location}&attribute=wind_speed`
        );

        const minWindSpeedResponse = await api.get(
          `/data/min?location=${props.location}&attribute=wind_speed`
        );

        const avgWindSpeedResponse = await api.get(
          `/data/avg?location=${props.location}&attribute=wind_speed`
        );

        insights.value = {
          maxTemperature: maxTemperatureResponse.data.temperature,
          minTemperature: minTemperatureResponse.data.temperature,
          avgTemperature: avgTemperatureResponse.data.average,
          maxHumidity: maxHumidityResponse.data.humidity,
          minHumidity: minHumidityResponse.data.humidity,
          avgHumidity: avgHumidityResponse.data.average,
          maxWindSpeed: maxWindSpeedResponse.data.wind_speed,
          minWindSpeed: minWindSpeedResponse.data.wind_speed,
          avgWindSpeed: avgWindSpeedResponse.data.average,
        };
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    };

    watchEffect(async () => {
      if (chartRef.value && !chartInstance) {
        const response = await api.get(`/data/span?location=${props.location}`);
        chartData.value = {
          labels: response.data.map((entry) => entry.timestamp),
          datasets: [
            {
              label: "Temperature (°C)",
              data: response.data.map((entry) => entry.temperature),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
            },
            {
              label: "Humidity (%)",
              data: response.data.map((entry) => entry.humidity),
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
            },
            {
              label: "Wind Speed (km/h)",
              data: response.data.map((entry) => entry.wind_speed),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
          ],
        };

        const ctx = chartRef.value.getContext("2d");
        chartInstance = new Chart(ctx, {
          type: "scatter",
          data: chartData.value,
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "day",
                },
              },
              y: {
                type: "linear",
                beginAtZero: true,
              },
            },
          },
        });
      } else if (chartInstance) {
        chartInstance.data = chartData.value;
        chartInstance.update();
      }
      await fetchInsights();
    });

    return {
      chartData,
      chartRef,
      insights,
    };
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
</style>
