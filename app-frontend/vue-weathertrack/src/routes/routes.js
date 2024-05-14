import { createRouter, createWebHistory } from "vue-router";
import { jwtDecode } from 'jwt-decode'

import Login from "@/views/LoginView.vue";
import Registration from "@/views/RegistrationView.vue";
import DataDisplay from "@/views/DataView.vue";
import Navbar from "@/components/Navbar.vue";
import Home from "@/views/HomeView.vue";
import ManageUsers from "@/views/ManageUsersView.vue";
import UserProfile from "@/views/UserProfileView.vue";
import Forbidden from "@/views/ForbiddenView.vue";
import Anomalies from "@/views/AnomaliesView.vue";
import ManageRequests from "@/views/ManageRequestsView.vue";
import UserRequests from "@/views/UserRequestsView.vue";
import Map from "@/views/MapView.vue";

const routes = [
  {
    path: "/login",
    component: Login,
    meta: { requiresAuth: false, requiresAdmin: false },
  },
  {
    path: "/register",
    component: Registration,
    meta: { requiresAuth: false, requiresAdmin: false },
  },
  {
    path: "/data-display",
    component: DataDisplay,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
  {
    path: "/anomalies",
    component: Anomalies,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
  {
    path: "/navbar",
    component: Navbar,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
  {
    path: "/home",
    component: Home,
    meta: { requiresAuth: false, requiresAdmin: false },
  },
  {
    path: "/",
    redirect: "/home",
    meta: { requiresAuth: false, requiresAdmin: false },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/home",
    meta: { requiresAuth: true, requiresAdmin: false },
  },
  {
    path: "/users",
    component: ManageUsers,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/requests",
    component: ManageRequests,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/requests-me",
    component: UserRequests,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
  {
    path: "/profile",
    component: UserProfile,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
  {
    path: "/forbidden",
    component: Forbidden,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
  {
    path: "/map",
    component: Map,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  let isAuthenticated = false;
  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    isAuthenticated = true;
    isAdmin = decoded.role === "admin";
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next("/login");
    } else if (to.matched.some((record) => record.meta.requiresAdmin) && !isAdmin) {
      next("/forbidden"); 
    } else {
      next();
    }
  } else {
    next();
  }
});


export default router;
