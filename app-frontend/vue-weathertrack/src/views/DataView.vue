<template>
  <div class="container">
    <h1 class="text-center mb-4">Latest Data</h1>
    <div class="row">
      <div class="col-md-6 col-lg-4" v-for="(socket, location) in getDataSockets" :key="location">
        <DataChild :location="location" :data-socket="socket" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DataChild from "@/components/DataChild.vue";

export default {
  components: {
    DataChild,
  },
  computed: {
    ...mapGetters(["getDataSockets"]),
  },
  mounted() {
    this.fetchLocations();
  },
  methods: {
    ...mapActions(["fetchLocations"]),
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

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  font-weight: bold;
  color: #007bff;
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  color: #343a40;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-text {
  color: #6c757d;
  margin-bottom: 0;
}
</style>
