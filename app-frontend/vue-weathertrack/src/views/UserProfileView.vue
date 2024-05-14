<template>
  <div class="container">
    <div>
      <h1 class="text-center mb-4">User Profile</h1>
      <div v-if="error" class="notification">
        <p>{{ error }}</p>
        <button @click="closeNotification">Close</button>
      </div>
      <form v-if="!editMode" @submit.prevent="openEditModal" class="mb-4">
        <p>Name: {{ user.username }}</p>
        <p class="mb-4">Email: {{ user.email }}</p>
        <button type="submit" class="btn btn-primary">Edit</button>
        <button class="btn btn-danger ml-3" @click="confirmDeleteAccount">
          Delete Account
        </button>
      </form>
      <form v-else @submit.prevent="updateUser" class="mb-4">
        <div class="form-group">
          <label for="username">Name:</label>
          <input
            type="text"
            id="username"
            v-model="editedUser.username"
            class="form-control"
            placeholder="Name"
          />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="editedUser.email"
            class="form-control"
            placeholder="Email"
          />
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
        <button
          type="button"
          class="btn btn-secondary ml-3"
          @click="closeEditModal"
        >
          Cancel
        </button>
      </form>
      <div v-if="deleteConfirmationVisible" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeDeleteConfirmation">&times;</span>
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete your account?</p>
          <button class="btn btn-danger" @click="confirmDeleteAccount">
            Yes
          </button>
          <button class="btn btn-secondary" @click="closeDeleteConfirmation">
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jwtDecode } from "jwt-decode";
import api from "../api";
export default {
  data() {
    return {
      user: {},
      editMode: false,
      editedUser: {},
      deleteConfirmationVisible: false,
      error: null,
      notificationTimeout: null,
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    showAlert(message) {
      this.error = message;
      clearTimeout(this.notificationTimeout);
      this.notificationTimeout = setTimeout(() => {
        this.error = null;
      }, 3000);
    },
    closeNotification() {
      this.error = null;
      clearTimeout(this.notificationTimeout);
    },
    async fetchUser() {
      try {
        const token = this.$store.state.authModule.token;
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          const response = await api.get(`/users/${userId}`);
          this.user = response.data;
          this.editedUser = { ...this.user };
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
    openEditModal() {
      this.editedUser = { ...this.user };
      this.editMode = true;
    },
    closeEditModal() {
      this.editMode = false;
      this.editedUser = {};
    },
    async updateUser() {
      try {
        const userId = this.user._id;
        const response = await api.put(`/users/${userId}`, this.editedUser);
        this.user = response.data;
        this.closeEditModal();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          if (error.response.data && error.response.data.message) {
            let message;
            if (error.response.data.message.includes("Email already exists")) {
              message = "Email already exists";
            } else if (
              error.response.data.message.includes("Username already exists")
            ) {
              message = "Username already exists";
            } else {
              message = "Username or email already exist";
            }
            this.showAlert(message);
          } else {
            this.showAlert("Duplicate entry");
          }
        } else if (error.response && error.response.status === 500) {
          this.showAlert(error.response.data.message);
        } else {
          console.error(error);
          this.showAlert("Update error");
        }
      }
    },
    confirmDeleteAccount() {
      this.deleteConfirmationVisible = true;
    },
    closeDeleteConfirmation() {
      this.deleteConfirmationVisible = false;
    },
    async deleteUser() {
      try {
        await api.delete(`/users/${this.user._id}`);
        this.$store.dispatch("authModule/logout");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
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

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.modal {
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

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}


.notification p {
  margin-bottom: 10px;
}



.mb-4 {
  margin-bottom: 1.5rem !important;
}

.ml-3 {
  margin-left: 1rem !important;
}

.btn-primary, .btn-danger {
  padding: 0.25rem;
}
</style>
