<template>
  <div>
    <h1 class="map-title">Locations Map</h1>
    <div id="map" style="height: 600px; padding-top: 60px"></div>
    <div v-if="showInfoWindow" class="info-window">
      <div class="window-content">
        <h2>{{ selectedLocation }}</h2>
        <p>Latitude: {{ selectedLatitude }}</p>
        <p>Longitude: {{ selectedLongitude }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api";

export default {
  data() {
    return {
      map: null,
      points: [],
      selectedLocation: null,
      selectedLatitude: null,
      selectedLongitude: null,
      showInfoWindow: false,
    };
  },
  async mounted() {
    this.initMap();
    const response = await api.get("/coordinates");
    this.points = response.data.map((location) => ({
      lat: location.latitude,
      lng: location.longitude,
      location: location.name,
    }));
    this.addPoints();
  },
  methods: {
    initMap() {
      const maxBounds = [
        [-90, -180],
        [90, 180],
      ];

      this.map = L.map("map", {
        worldCopyJump: true,
        maxBounds: maxBounds,
      }).setView([0, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
    },
    addPoints() {
      this.points.forEach((point) => {
        const marker = L.marker([point.lat, point.lng])
          .addTo(this.map)
          .bindTooltip("", { permanent: false, direction: "right" });

        marker.on(
          "mouseover",
          async function (e) {
            try {
              const response = await api.get(
                `/data/latest?location=${point.location}`
              );
              const data = response.data;
              const tooltipContent = `
      <strong>${point.location}</strong><br>
      Temperature: ${data.temperature.toFixed(1)}°C<br>
      Humidity: ${data.humidity.toFixed(1)}%<br>
      Wind Speed: ${data.wind_speed.toFixed(1)} km/h<br>
      Condition: ${data.condition}<br>
    `;
              marker.setTooltipContent(tooltipContent);
              marker.openTooltip();
            } catch (error) {
              console.error(error);
            }
          }.bind(this)
        );

        marker.on("mouseout", function (e) {
          this.closeTooltip();
        });

        marker.on("click", () => {
          this.$router.push({ path: "/data-display" });
        });
      });
    },
    showInfo(lat, lng, location) {
      this.selectedLatitude = lat;
      this.selectedLongitude = lng;
      this.selectedLocation = location;
      this.showInfoWindow = true;
    },
    hideInfo() {
      this.showInfoWindow = false;
    },
  },
};
</script>

<style>
.info-window {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.window-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
}

.map-title {
  text-align: center;
  padding-top: 2rem;
  margin-bottom: 0.5rem;
  color: #007bff;
  font-weight: bold;
}
</style>
