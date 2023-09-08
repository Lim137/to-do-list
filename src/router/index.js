import { createRouter, createWebHistory } from "vue-router";
import TaskList from "@/components/TaskTracker.vue";
import Login from "@/auth/LoginPopup.vue";
import Register from "@/auth/RegisterPopup.vue";

const routes = [
  {
    path: "/",
    component: TaskList,
    meta: { requiresAuth: true },
    name: "home",
  },
  {
    path: "/login",
    component: Login,
    meta: { requiresAuth: false },
    name: "login",
  },
  {
    path: "/register",
    component: Register,
    meta: { requiresAuth: false },
    name: "reg",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const logInfoRemember = localStorage.getItem(`loggedInUser`);
  const logInfoNotRemember = sessionStorage.getItem(`loggedInUser`);

  if (to.meta.requiresAuth && !logInfoRemember && !logInfoNotRemember) {
    next("/login");
  } else {
    next();
  }
});
export default router;
