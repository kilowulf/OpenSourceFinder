<template>
  <header class="bg-blue-600 text-white px-6 py-4">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/">
        <h1 class="text-xl font-bold">Open Source Finder</h1>
      </router-link>
      <nav>
        <ul class="flex space-x-6">
          <!-- <li><router-link to="/" class="hover:text-blue-300">Home</router-link></li> -->
          <!-- <li><router-link to="/signin" class="hover:text-blue-300">Sign In</router-link></li> -->
          <!-- <li><router-link to="/signup" class="hover:text-blue-300">Sign Up</router-link></li> -->
          <li v-if="isUserLoggedIn">
            <router-link to="/user-profile" class="hover:text-blue-300"
              >User Profile</router-link
            >
          </li>
          
          <li v-if="isUserLoggedIn">
            <router-link to="/search-projects" class="hover:text-blue-300"
              >search Projects</router-link
            >
          </li>
          <li v-if="isUserLoggedIn">
            <router-link
              @click.prevent="signOut"
              to="/signin"
              class="hover:text-blue-300"
              >Sign Out</router-link
            >
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  computed: {
    isUserLoggedIn() {
      // Replace this condition with a proper check of the user's logged-in status
      // using your state management solution (e.g., Vuex) or local storage
      return this.$store.state.userLoggedIn;
    }
  },
  methods: {
    signOut() {
      // Replace this with a proper function to clear user authentication status
      this.$store.commit("clearUserAuthentication");
      // Redirect to sign-in page
      this.$router.push("/signin");
    }
  }
};
</script>
