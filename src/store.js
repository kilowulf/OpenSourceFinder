import { createStore } from "vuex";
import axios from "axios";
// import User from "../models/User.js";

const store = createStore({
  state: {
    userId: localStorage.getItem("userId") || null,
    user: null,
    userData: null,
    registrationData: null,
    userLoggedIn: false,
    projectsData: [],
    recommendedProjects: [],
    searchResults: [],
    projectUrl: "",
    userProjects: []
  },
  actions: {
    setUser({ commit }, user) {
      commit("setUser", user);
    },

    setUserLoggedIn(state, userLoggedIn) {
      state.userLoggedIn = userLoggedIn;
    },
    updateProjectsData({ commit }, data) {
      commit("setProjectsData", data);
    },
    updateSearchResults({ commit }, data) {
      commit("setSearchResults", data);
    },
    updateUserData({ commit }, userData) {
      commit("updateUser", userData);
    },
    updateUserProjects({ commit }, projects) {
      commit("setUserProjects", projects);
    },
    addUserProject({ commit }, project) {
      commit("addUserProject", project);
    },
    removeUserProject({ commit }, projectId) {
      commit("removeUserProject", projectId);
    },
    setProjectUrl({ commit }, url) {
      commit("setProjectUrl", url);
    },
    async loadUserData({ commit }, userId) {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        commit("setUserData", response.data);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    },
    async saveUserData({ state }) {
      try {
        await axios.post("/api/user/save", state.userData);
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    },
    async createUser({ commit }, userData) {
      try {
        const response = await axios.post("/api/user/create", userData);
        commit("setUserData", response.data.User);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    },
    saveUserId({ commit }, userId) {
      localStorage.setItem("userId", userId);
      commit("setUserId", userId);
    },
    async login({ commit }, { email, password }) {
      try {
        const response = await axios.post("/api/auth/login", {
          email,
          password
        });
        console.log("from store login", response.data);
        commit("setUserLoggedIn", true);
        localStorage.setItem("userId", response.data.User._id);
      } catch (error) {
        console.error("Error during login:", error.message);
        throw error;
      }
    },
    async register({ commit }, userData) {
      try {
        const response = await axios.post("/api/user/register", userData);

        commit("setUser", response.data.User);
        commit("setUserLoggedIn", true);
        localStorage.setItem("userId", response.data.User._id);
      } catch (error) {
        console.error("Error during registration:", error.message);
        throw error;
      }
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUserData(state, userData) {
      state.user = userData;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    setUserLoggedIn(state, userData) {
      state.userLoggedIn = true;
      state.user = userData;
    },
    setProjectsData(state, data) {
      state.projectsData = data;
    },
    setRegistrationData(state, data) {
      state.registrationData = data;
    },
    clearUserAuthentication(state) {
      state.user = null;
      state.userLoggedIn = false;
    },
    updateProjectsData(state, data) {
      state.projectsData = data;
    },
    updateUser(state, userData) {
      state.user = { ...state.user, ...userData };
    },
    addRecommendedProjects(state, data) {
      state.recommendedProjects.push(data);
    },
    setSearchResults(state, data) {
      state.searchResults = data;
    },
    setUserProjects(state, projects) {
      state.userProjects = projects;
    },
    addUserProject(state, project) {
      state.userProjects.push(project);
    },
    removeUserProject(state, projectId) {
      state.userProjects = state.userProjects.filter(
        project => project.id !== projectId
      );
    },
    setProjectUrl(state, url) {
      state.projectUrl = url;
    }
  },
  getters: {
    // ...
    getUserData: state => {
      return state.user;
    },
    isUserLoggedIn: state => {
      return state.userLoggedIn;
    },
    getProjectsData: state => {
      return state.projectsData;
    },
    getSearchResults: state => {
      return state.searchResults;
    },
    getUserProjects: state => {
      return state.userProjects;
    },
    projectUrl: state => {
      const selectedProject = state.userProjects.find(
        project => project.selected === true
      );

      if (selectedProject) {
        return selectedProject.url;
      }

      return null;
    }
  }
});
export default store;
