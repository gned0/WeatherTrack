<template>
  <div class="container">
    <h1>All Users</h1>
    <button
      @click="showCreateUserForm = !showCreateUserForm"
      class="btn btn-primary add-user-button"
    >
      {{ showCreateUserForm ? "Hide" : "Create New User" }}
    </button>
    <div v-if="showCreateUserForm" class="my-4">
      <h2>Create New User</h2>
      <form @submit.prevent="registerUser">
        <div class="form-group">
          <label for="username">Username:</label>
          <input
            type="text"
            id="username"
            v-model="newUser.username"
            required
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="newUser.email"
            required
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            v-model="newUser.password"
            required
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="role">Role:</label>
          <select
            id="role"
            v-model="newUser.role"
            required
            class="form-control"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Create User</button>
      </form>
    </div>

    <ul>
      <li v-for="user in users" :key="user._id">
        <div>
          <h2>{{ user.username }}</h2>
          <p>Email: {{ user.email }}</p>
          <p>Role: {{ user.role }}</p>
          <button
            @click="showUserDetails(user)"
            class="btn btn-secondary view-details-button"
          >
            View Details
          </button>
        </div>
        <div v-if="selectedUser && selectedUser._id === user._id">
          <h2>User Details</h2>
          <h3>{{ selectedUser.username }}</h3>
          <p>Email: {{ selectedUser.email }}</p>
          <p>Role: {{ selectedUser.role }}</p>
          <label for="role">Change Role:</label>
          <select id="role" v-model="newRole">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            @click="updateUserRole(selectedUser._id)"
            class="btn btn-primary update-close-buttons"
          >
            Update Role
          </button>
          <button
            @click="closeUserDetails"
            class="btn btn-secondary update-close-buttons"
          >
            Close
          </button>
        </div>
        <button
          @click="deleteUser(user._id)"
          class="btn btn-primary delete-button"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      users: [],
      selectedUser: null,
      newRole: "",
      newUser: {
        username: "",
        email: "",
        password: "",
        role: "user",
      },
      showCreateUserForm: false,
    };
  },
  mounted() {
    this.getAllUsers();
  },
  methods: {
    async getAllUsers() {
      try {
        const response = await api.get("/users");
        this.users = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    showUserDetails(user) {
      this.selectedUser = user;
      this.newRole = user.role;
    },
    closeUserDetails() {
      this.selectedUser = null;
      this.newRole = "";
    },
    async updateUserRole(userId) {
      try {
        const response = await api.put(`/users/${userId}`, {
          role: this.newRole,
        });
        console.log(response.data);
        this.getAllUsers();
        this.closeUserDetails();
      } catch (error) {
        console.error(error);
      }
    },
    async registerUser() {
      try {
        const response = await api.post("/auth/register", this.newUser);
        console.log(response.data);
        this.newUser = {
          username: "",
          email: "",
          password: "",
          roles: "user",
        };
        this.showCreateUserForm = false;
        this.getAllUsers();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteUser(userId) {
      try {
        const response = await api.delete(`/users/${userId}`);
        console.log(response.data);
        this.getAllUsers();
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
.add-user-button {
  margin-bottom: 1rem;
}

.update-close-buttons {
  margin-right: 1rem;
}

.update-close-buttons,
.delete-button,
.view-details-button {
  margin-top: 0.5rem;
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
