<template>
  <div class="w-full max-w-sm mx-auto">
    <h1 class="text-xl font-bold mb-6">Sign In</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="email" class="block mb-1">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="w-full border-2 border-gray-300 p-2 rounded focus:border-blue-500"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block mb-1">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="w-full border-2 border-gray-300 p-2 rounded focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Sign In
      </button>
    </form>
    <div class="mt-4">
      <p>
        Don't have an account?
        <router-link to="/signup" class="text-blue-600 hover:text-green-400"
          >Create Account</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";

export default {
  name: "SignIn",
  data() {
    return {
      email: "",
      password: "",
      error: null
    };
  },
  methods: {
    ...mapActions(["setUserLoggedIn", "login"]),
    async submitForm() {
      try {
        await this.login({
          email: this.email,
          password: this.password
        });
        this.$router.push({ name: "SearchProjects" });
      } catch (error) {
        this.error = "Invalid email or password";
      }
    }
  }
};
</script>
