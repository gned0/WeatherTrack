<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1 class="text-center mb-4">My Requests</h1>
        <button
          @click="showCreateRequestForm = !showCreateRequestForm"
          class="btn btn-primary mb-3"
        >
          {{ showCreateRequestForm ? "Hide" : "Create New Request" }}
        </button>
        <div v-if="showCreateRequestForm">
          <h2 class="mb-3">Create New Request</h2>
          <form @submit.prevent="createRequest">
            <div class="form-group">
              <label for="title">Title:</label>
              <input
                type="text"
                id="title"
                v-model="title"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea
                id="description"
                v-model="description"
                class="form-control"
                required
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary">
              Create Request
            </button>
          </form>
        </div>
        <div v-if="requests.length > 0">
          <ul>
            <li v-for="request in requests" :key="request._id">
              <div>
                <h2 class="mb-3">{{ request.title }}</h2>
                <p>{{ request.description }}</p>
                <p>Status: {{ request.status }}</p>
                <p>
                  Created: {{ $filters.formatTimestamp(request.createdAt) }}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="alert alert-info">No requests found</div>
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
      title: "",
      description: "",
      requests: [],
      error: null,
      showCreateRequestForm: false,
    };
  },
  mounted() {
    this.getRequestsByUser();
  },
  methods: {
    async createRequest() {
      try {
        const token = this.$store.state.authModule.token;
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          const response = await api.post("/requests", {
            userId: userId,
            title: this.title,
            description: this.description,
          });
          console.log(response.data);
          this.title = "";
          this.description = "";
          this.showCreateRequestForm = false;
          this.getRequestsByUser();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getRequestsByUser() {
      try {
        const token = this.$store.state.authModule.token;
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          const response = await api.get(`/my-requests?id=${userId}`);
          this.requests = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding-top: 4rem;
}

h1,
h2 {
  color: #007bff;
  font-weight: bold;
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

.form-group label {
  font-weight: bold;
  color: #007bff;
}

.form-control {
  border-color: #ced4da;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.list-group-item {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.list-group-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
button {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

label {
  font-weight: bold;
  color: #007bff;
}

input,
textarea,
select {
  border-color: #ced4da;
  transition: border-color 0.3s ease;
  padding: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  padding: 1rem;
  margin-bottom: 1rem;
}

li:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.add-request-button {
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
}

.update-close-buttons {
  margin-right: 1rem;
}
.view-details-button {
  margin-bottom: 1rem;
}
</style>
