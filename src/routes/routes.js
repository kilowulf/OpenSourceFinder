import { createRouter, createWebHistory } from "vue-router";
import Welcome from "@/components/Welcome.vue";
import SignIn from "@/components/SignIn.vue";
import SignUp from "@/components/SignUp.vue";
import UserProfile from "@/components/UserProfile.vue";
import Project from "@/components/Project.vue";

import SearchProjects from "@/components/SearchProjects.vue";

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome
  },
  { path: "/signin", name: "SignIn", component: SignIn },
  { path: "/signup", name: "SignUp", component: SignUp },
  {
    path: "/user-profile",
    name: "UserProfile",
    component: UserProfile,
    props: true
  },
  {
    path: "/search-projects",
    name: "SearchProjects",
    component: SearchProjects,
    props: true
  },
  {
    path: "/project/:id",
    name: "Project",
    component: Project
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
