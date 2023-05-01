<template>
  <div v-if="user" class="w-full max-w-lg mx-auto mt-10">
    <h1 class="text-xl font-bold mb-6 text-center text-gray-700">
      User Profile
    </h1>

    <!-- User Image Section -->
    <div class="user-image-section mb-6 text-center relative">
      <img
        :src="user.profileImageUrl || 'src/assets/default-user-image.png'"
        class="w-32 h-32 object-cover rounded-full mx-auto"
        @click="uploadUserImage"
      />
      <!-- Add the following click-to-edit div -->
      <div
        v-if="!user.profileImageUrl"
        class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-xs font-semibold bg-black bg-opacity-50 rounded-full cursor-pointer"
        @click="uploadUserImage"
      >
        Click to edit
      </div>
      <input
        type="file"
        ref="userImageInput"
        class="hidden"
        @change="changeUserImage"
      />
      <div class="mt-4">
        <a
          v-if="user.facebookUrl"
          :href="user.facebookUrl"
          class="mx-2 text-blue-700"
          target="_blank"
          ><i class="fab fa-facebook-square fa-2x"></i
        ></a>
        <a
          v-if="user.linkedinUrl"
          :href="user.linkedinUrl"
          class="mx-2 text-blue-500"
          target="_blank"
          ><i class="fab fa-linkedin fa-2x"></i
        ></a>
      </div>
    </div>
    <!-- End User Image Section -->

    <form @submit.prevent="submitForm" class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <label class="text-gray-600 font-bold mr-2">Name / UserName:</label>
        <input
          v-model="editedUser.username"
          type="text"
          class="input-width border-2 border-gray-300 p-2 rounded focus:border-blue-500"
          :readonly="!isEditing"
        />
      </div>
      <div class="mb-4">
        <label class="text-gray-600 font-bold mr-2">Email:</label>
        <input
          v-model="editedUser.email"
          type="email"
          class="input-width border-2 border-gray-300 p-2 rounded focus:border-blue-500"
          :readonly="!isEditing"
        />
      </div>
      <div class="mb-4">
        <label for="password" class="text-gray-600 font-bold mr-2"
          >Password:</label
        >
        <input
          v-model="editedUser.password"
          type="password"
          id="password"
          class="input-width border-2 border-gray-300 p-2 rounded focus:border-blue-500"
          :readonly="!isEditing"
        />
      </div>
      <div class="mb-4">
        <label class="text-gray-600 font-bold mr-2">Current Occupation:</label>
        <input
          v-model="editedUser.occupation"
          type="text"
          class="input-width border-2 border-gray-300 p-2 rounded focus:border-blue-500"
          :readonly="!isEditing"
        />
      </div>
      <div class="mb-4">
        <label class="text-gray-600 font-bold mr-2">Project Language:</label>
        <div v-if="isEditing">
          <label
            v-for="lang in languageOptions"
            :key="lang.value"
            class="inline-flex items-center mr-4"
          >
            <input
              type="checkbox"
              :value="lang.value"
              v-model="editedUser.languages"
              class="form-checkbox h-4 w-4 text-blue-600 border-blue-600 rounded"
            />
            <span class="ml-2 text-gray-700">{{ lang.label }}</span>
          </label>
        </div>
        <div v-else>{{ editedUser.languages.join(", ") }}</div>
      </div>
      <div class="mb-4">
        <label class="text-gray-600 font-bold mr-2">Project Labels:</label>
        <div v-if="isEditing">
          <label
            v-for="label in labelOptions"
            :key="label.value"
            class="inline-flex items-center mr-4"
          >
            <input
              type="checkbox"
              :value="label.value"
              v-model="editedUser.labels"
              class="form-checkbox h-4 w-4 text-blue-600 border-blue-600 rounded"
            />
            <span class="ml-2 text-gray-700">{{ label.label }}</span>
          </label>
        </div>
        <div v-else>{{ editedUser.labels.join(", ") }}</div>
      </div>
      <button
        v-if="isEditing"
        type="submit"
        class="bg-green-600 text-white px-4 py-2 mx-2 rounded hover:bg-green-700"
      >
        Save Changes
      </button>
      <button
        type="button"
        @click="isEditing = !isEditing"
        class="bg-red-600 text-white px-4 py-2 mx-2 rounded hover:bg-red-700"
      >
        {{ isEditing ? "Cancel" : "Edit Profile" }}
      </button>
      <button
        v-if="!isEditing"
        type="button"
        @click="searchProjects"
        class="bg-blue-600 text-white px-4 py-2 mx-2 rounded hover:bg-blue-700"
      >
        Search Projects
      </button>
    </form>

    <!-- My Projects Section -->
    <div class="my-projects-section mt-10">
      <h2 class="text-2xl font-bold mb-4 text-gray-700">My Projects</h2>
      <div v-if="getUserProjects.length === 0">No projects added.</div>
      <div
        v-for="(project, index) in getUserProjects"
        :key="index"
        class="mb-4 border rounded-lg p-4"
      >
        <h3 class="text-lg font-semibold text-gray-700">{{ project.name }}</h3>
        <p class="text-gray-500">{{ project.description }}</p>
        <a
          :href="project.html_url"
          class="text-blue-500 hover:text-blue-600"
          target="_blank"
        >
          View Project
        </a>

        <button
          @click="removeProject(project.id)"
          class="ml-4 text-red-500 hover:text-red-600"
        >
          Delete Project
        </button>
      </div>
    </div>
    <!-- End My Projects Section -->
  </div>
  <div v-else>
    <p>Loading user profile...</p>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import axios from "axios";

export default {
  name: "UserProfile",
  data() {
    return {
      editedUser: {
        languages: [],
        labels: []
      },
      isEditing: false,
      languages: [],
      labels: [],
      languageOptions: [
        { label: "JavaScript", value: "javascript", selected: false },
        { label: "HTML", value: "html", selected: false },
        { label: "Python", value: "py", selected: false }
      ],
      labelOptions: [
        {
          label: "Good First Issue",
          value: "good-first-issue",
          selected: false
        },
        { label: "Help Wanted", value: "help-wanted", selected: false }
      ]
    };
  },
  computed: {
    ...mapGetters(["getUserData", "getUserProjects"]),
    user() {
      return this.getUserData;
    },
    // getUserData() {
    //   return this.$store.getters.getUserData;
    // },
    getProjects() {
      return this.$store.getters.getUserProjects;
    },
    projectUrl() {
      return this.$store.getters.projectUrl;
    }
  },
  methods: {
    ...mapActions(["updateUserData", "addUserProject", "saveUserData"]),
    async submitForm() {
      this.saveChanges();
      await this.$store.dispatch("saveUserData");
    },
    async saveChanges() {
      console.log("Save changes", this.editedUser);
      this.updateUserData(this.editedUser);
      await this.saveUserData(this.editedUser);
      this.isEditing = false;
      // Call API or update user information in state management
    },
    async fetchUserData() {
      try {
        const userId = this.$store.state.userId; // Fetch the user ID from local storage
        // if (!userId) {
        //   throw new Error("User ID is missing.");
        // }
        const response = await axios.get(
          `http://localhost:3000/api/user/${userId}`
        );
        console.log("from fetchUserData: userProfile.vue", response.data);
        this.$store.dispatch("updateUserData", response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    // generateId() {
    //   return "_" + Math.random().toString(36).substr(2, 9);
    // },
    removeProject(projectId) {
      this.$store.dispatch("removeUserProject", projectId);
    },
    uploadUserImage() {
      this.$refs.userImageInput.click();
    },
    changeUserImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Create a FileReader to read the image file
      const reader = new FileReader();

      // Define what to do once the image is read by the FileReader
      reader.onload = (e) => {
        // Set the user's profileImageUrl to the result of the FileReader
        this.editedUser.profileImageUrl = e.target.result;
        this.updateUserData(this.editedUser); // Update the user data
      };

      // Read the image file as a data URL
      reader.readAsDataURL(file);
    },

    async updateUserProfile() {
      try {
        const response = await axios.put(`/api/auth/update/${this.user._id}`, {
          profileImageUrl: this.profileImageUrl,
          facebookUrl: this.facebookUrl,
          linkedinUrl: this.linkedinUrl,
          projects: this.projects,
          recommendedProjects: this.recommendedProjects
        });

        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },

    async searchProjects() {
      // assign languages and labels if profile edited(editedUser),
      // or if not (getUserData)
      const languages = this.isEditing
        ? this.editedUser.languages
        : this.getUserData.languages;
      const labels = this.isEditing
        ? this.editedUser.labels
        : this.getUserData.labels;

      try {
        const response = await axios.post("http://localhost:3000/search", {
          languages,
          labels,
          frameworks: null
        });
        console.log("Request body:", response.data);
        // Navigate to VisualizationChart.vue and pass the data as a prop
        this.$router.push({
          name: "SearchProjects",
          query: { projectsData: JSON.stringify(response.data) }
        });

        this.$store.dispatch("updateProjectsData", response.data);
        this.$store.commit("addRecommendedProjects", response.data);

        // Process the response data and update your component state
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data from the server", error);
      }
    },
    initializeEditedUser() {
      this.editedUser = JSON.parse(JSON.stringify(this.user));

      // this.languageOptions.forEach((lang) => {
      //   lang.selected = this.getUserData.languages.includes(lang.value);
      // });

      // this.labelOptions.forEach((label) => {
      //   label.selected = this.getUserData.labels.includes(label.value);
      // });

      // const languages = this.languageOptions
      //   .filter((lang) => lang.selected)
      //   .map((lang) => lang.value);

      // const labels = this.labelOptions
      //   .filter((label) => label.selected)
      //   .map((label) => label.value);

      // this.editedUser = {
      //   id: this.user._id, // Include the id property from getUserData
      //   ...this.getUserData,
      //   languages,
      //   labels
      // };
    }
  },
  watch: {
    user() {
      this.initializeEditedUser();
    }
    // getUserData: {
    //   deep: true,
    //   immediate: true,
    //   handler(userData) {
    //     if (userData) {
    //       this.editedUser = JSON.parse(JSON.stringify(userData));
    //     }
    //   }
    // }
  },
  created: async function () {
    // lifecycle hook
    await this.fetchUserData();
    this.initializeEditedUser();
    console.log("User data:", this.user);

    // Initialize editedUser with values from getUserData when the component is created
    // if (this.getUserData) {
    //   this.initializeEditedUser();
    // }
    // Call the fetchUserData method to get the user data from the API

    // Load user data from the server when the component is created
    // if (!this.getUserData) {
    //   this.$store.dispatch("loadUserData", this.user._id);
    // }
  }
};
</script>

<style scoped>
.input-width {
  width: 100%;
}
</style>
