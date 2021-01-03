import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import axios from "axios";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      registerdUser: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const REST_API_SERVER = "http://localhost:3000/";
  const token = localStorage.getItem("access_token");
  // console.log(token);
  if (!token && to.meta.registerdUser) {
    next({ path: "/" });
  } else if (token && to.meta.registerdUser) {
    try {
      const isValid = await axios.post(
        `${REST_API_SERVER}api/jwtvalidate`,
        {},
        { headers: { access_token: token } }
      );
      if (isValid) {
        next();
      }
    } catch (err) {
      next("/");
    }
  } else {
    next();
  }
});

export default router;
