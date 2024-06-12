<template>
  <div class="container">
    <h1>All Requests</h1>
    <button
      @click="showCreateRequestForm = !showCreateRequestForm"
      class="btn btn-primary add-request-button"
    >
      {{ showCreateRequestForm ? "Hide new request creation" : "Add new request" }}
    </button>
    <div v-if="showCreateRequestForm">
      <h2>Create New Request</h2>
      <form @submit.prevent="createRequest">
        <div>
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="newRequest.title" required />
        </div>
        <div>
          <label for="description">Description:</label>
          <textarea
            id="description"
            v-model="newRequest.description"
            required
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Create Request</button>
      </form>
    </div>

    <ul>
      <li v-for="request in requests" :key="request._id">
        <div>
          <h2>{{ request.title }}</h2>
          <p>Created at: {{ $filters.formatTimestamp(request.createdAt) }}</p>
          <button
            @click="showRequestDetails(request)"
            class="btn btn-secondary view-details-button"
          >
            View Details
          </button>
        </div>
        <div v-if="selectedRequest && selectedRequest._id === request._id">
          <h2>Request Details</h2>
          <h3>{{ selectedRequest.title }}</h3>
          <p>Description: {{ selectedRequest.description }}</p>
          <p>Status: {{ selectedRequest.status }}</p>
          <label for="status">Change Status:</label>
          <select id="status" v-model="newStatus">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            @click="updateRequestStatus(selectedRequest._id)"
            class="btn btn-primary update-close-buttons"
          >
            Update Status
          </button>
          <button
            @click="closeRequestDetails"
            class="btn btn-secondary update-close-buttons"
          >
            Close
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../api";
import { jwtDecode } from "jwt-decode";

export default {
  data() {
    return {
      requests: [],
      selectedRequest: null,
      newStatus: "",
      newRequest: {
        title: "",
        description: "",
      },
      showCreateRequestForm: false,
    };
  },
  mounted() {
    this.getAllRequests();
  },
  methods: {
    async getAllRequests() {
      try {
        const response = await api.get("/requests");
        this.requests = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    showRequestDetails(request) {
      this.selectedRequest = request;
      this.newStatus = request.status;
    },
    closeRequestDetails() {
      this.selectedRequest = null;
      this.newStatus = "";
    },
    async updateRequestStatus(requestId) {
      try {
        const response = await api.put(`/requests/${requestId}`, {
          status: this.newStatus,
        });
        console.log(response.data);
        this.getAllRequests();
        this.closeRequestDetails();
      } catch (error) {
        console.error(error);
      }
    },
    async createRequest() {
      try {
        const token = this.$store.state.authModule.token;
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          const response = await api.post("/requests", {
            userId: userId,
            title: this.newRequest.title,
            description: this.newRequest.description,
          });
          this.title = "";
          this.description = "";
          this.showCreateRequestForm = false;
          this.getAllRequests();
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
