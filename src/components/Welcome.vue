<template>
  <div class="landing-page">
    <div class="container mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-center text-gray-700 mb-8">
        Welcome to Open Source Finder
      </h1>
      <p class="text-xl text-center text-gray-600 mb-8">
        Discover amazing open source projects and contribute to the world of open source.
      </p>
      <div class="flex justify-center">
        <router-link to="/signin" class="btn btn-blue mr-4">Sign In</router-link>
        <router-link to="/signup" class="btn btn-yellow">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
};
</script>

<style scoped>
.btn {
  display: inline-block;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-align: center;
}

.btn-blue {
  background-color: #3182ce;
  color: #fff;
  transition: background-color 0.3s ease;
}

.btn-blue:hover {
  background-color: #2b6cb0;
}

.btn-yellow {
  background-color: #d69e2e;
  color: #fff;
  transition: background-color 0.3s ease;
}

.btn-yellow:hover {
  background-color: #b7791f;
}
</style>
