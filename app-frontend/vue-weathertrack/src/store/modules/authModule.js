import axios from "axios";
import { jwtDecode } from 'jwt-decode'

const api = axios.create({
    baseURL: "http://localhost:3000",
  });

const state = {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
  }
  
  const mutations = {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_ROLE(state, role) {
      state.role = role
      localStorage.setItem('role', role)
    },
  }
  
  const actions = {
    login({ commit }, credentials) {
      return api.post('/auth/login', credentials)
        .then((response) => {
          if (response.data && response.data.token) {
            const token = response.data.token;
            const decodedToken = jwtDecode(token);
            const role = decodedToken.role;
  
            commit('SET_TOKEN', token);
            commit('SET_ROLE', role);
            return response; // Return the response object
          } else {
            console.error('Login response missing token');
            return Promise.reject('Login response missing token');
          }
        })
        .catch((error) => {
          console.error('Login error:', error);
          throw error; // Re-throw the error to propagate it to the caller
        });
    },
    logout({ commit }) {
      commit('SET_TOKEN', null)
      commit('SET_ROLE', null)
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    },
  }
  
  const getters = {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'admin',
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
  }
  