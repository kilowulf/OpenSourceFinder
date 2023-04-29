import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state: {
    userId: localStorage.getItem("userId") || null,
    user: null,
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

    setUserLoggedIn({ commit }, loggedIn) {
      commit("setUserLoggedIn", loggedIn);
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
        commit("setUserData", response.data);
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
        commit("setUser", response.data.user);
        commit("setUserLoggedIn", true);
        localStorage.setItem("userId", response.data.user._id);
      } catch (error) {
        console.error("Error during login:", error.message);
        throw error;
      }
    },
    async register({ commit }, userData) {
      try {
        const response = await axios.post("/api/auth/register", userData);
        commit("setUser", response.data.user);
        commit("setUserLoggedIn", true);
        localStorage.setItem("userId", response.data.user._id);
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
    setUserId(state, userId) {
      state.userId = userId;
    },
    setUserLoggedIn(state, loggedIn) {
      state.userLoggedIn = loggedIn;
    },
    setProjectsData(state, data) {
      state.projectsData = data;
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
