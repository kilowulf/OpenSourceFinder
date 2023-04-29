<template>
  <div class="w-full max-w-sm mx-auto">
    <h1 class="text-xl font-bold mb-6">Sign Up</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="name" class="block mb-1">Name</label>
        <input
          type="text"
          id="name"
          v-model="username"
          class="w-full border-2 border-gray-300 p-2 rounded focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <label for="email" class="block mb-1">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="w-full border-2 border-gray-300 p-2 rounded focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <label for="occupation" class="block mb-1">Current Occupation</label>
        <input
          type="text"
          id="occupation"
          v-model="occupation"
          class="w-full border-2 border-gray-300 p-2 rounded focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-bold">Project Language</label>
        <div>
          <label
            v-for="lang in languageOptions"
            :key="lang.value"
            class="inline-flex items-center mr-4"
          >
            <input
              type="checkbox"
              :value="lang.value"
              v-model="lang.selected"
              class="form-checkbox h-4 w-4 text-blue-600 border-blue-600 rounded"
            />
            <span class="ml-2 text-gray-700">{{ lang.label }}</span>
          </label>
        </div>
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-bold">Project Labels</label>
        <div>
          <label
            v-for="label in labelOptions"
            :key="label.value"
            class="inline-flex items-center mr-4"
          >
            <input
              type="checkbox"
              :value="label.value"
              v-model="label.selected"
              class="form-checkbox h-4 w-4 text-blue-600 border-blue-600 rounded"
            />
            <span class="ml-2 text-gray-700">{{ label.label }}</span>
          </label>
        </div>
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
        Sign Up
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";

export default {
  name: "SignUp",
  data() {
    return {
      email: "",
      password: "",
      username: "",
      occupation: "",
      languages: [],
      labels: [],
      languageOptions: [
        { label: "JavaScript", value: "javascript" },
        { label: "HTML", value: "html" },
        { label: "Python", value: "py" }
      ],
      labelOptions: [
        {
          label: "Good First Issue",
          value: "good-first-issue"
        },
        { label: "Help Wanted", value: "help-wanted" }
      ]
    };
  },
  methods: {
    //  ...mapMutations(['setUser', 'setUserLoggedIn']),
    ...mapActions(["updateUserData", "setUser", "setUserLoggedIn", "register"]),

    async submitForm() {
      try {
        const userData = {
          username: this.username,
          email: this.email,
          password: this.password,
          occupation: this.occupation,
          languages: this.languageOptions
            .filter((option) => option.selected)
            .map((option) => option.value),
          labels: this.labelOptions
            .filter((option) => option.selected)
            .map((option) => option.value)
        };

        await this.register(userData);
        this.$router.push({ name: "UserProfile" });
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  }
};
</script>
