<template>
  <div>
    <h1 class="map-title">Locations Map</h1>
    <div id="map" style="height: 600px; padding-top: 60px;"></div>
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

export default {
  data() {
    return {
      map: null,
      points: [
        { lat: 37.7749, lng: -122.4194, location: "San Francisco" },
        { lat: 51.5074, lng: -0.1278, location: "London" },
        { lat: 48.8566, lng: 2.3522, location: "Paris" },
        { lat: 34.0522, lng: -118.2437, location: "Los Angeles" },
        { lat: 52.3676, lng: 4.9041, location: "Amsterdam" },
        { lat: 41.9028, lng: 12.4964, location: "Rome" },
        { lat: 40.7128, lng: -74.006, location: "New York" },
        { lat: 48.1351, lng: 11.582, location: "Munich" },
        { lat: 49.2827, lng: -123.1207, location: "Vancouver" },
        { lat: -33.8688, lng: 151.2093, location: "Sydney" },
      ],
      selectedLocation: null,
      selectedLatitude: null,
      selectedLongitude: null,
      showInfoWindow: false,
    };
  },
  mounted() {
    this.initMap();
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
          .on("mouseover", () => {
            this.showInfo(point.lat, point.lng, point.location);
          })
          .on("mouseout", () => {
            this.hideInfo();
          })
          .on("click", () => {
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
