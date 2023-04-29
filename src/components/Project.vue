<template>
  <div class="project-container">
    <div v-if="project" class="project">
      <h1>
        <strong>Project: </strong>
        {{ project.name }}
      </h1>

      <p><strong>Description:</strong>{{ project.description }}</p>
      <p><strong>Language:</strong> {{ project.language }}</p>
      <p><strong>Stars:</strong> {{ project.stargazers_count }}</p>
      <p v-if="project.license">
        <strong>License:</strong> {{ project.license.name }}
      </p>
      <p v-else><strong>License:</strong> N/A</p>

      <p><strong>Last updated:</strong> {{ formatDate(project.updated_at) }}</p>
      <a :href="project.html_url" target="_blank">View on GitHub</a>
      <button
        @click="addToMyProjects"
        :class="{ 'project-added': projectAdded }"
      >
        {{ projectAdded ? "Project Added" : "Add to My Projects" }}
      </button>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Project",
  data() {
    return {
      project: {
        name: "",
        description: "",
        html_url: "",
        language: "",
        stargazers_count: "",
        license: {},
        updated_at: ""
      },
      projectAdded: false
    };
  },
  computed: {
    projectUrl() {
      return this.$store.getters.html_url;
    }
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString();
    },
    async fetchProjectDetails() {
      if (!this.html_url) {
        console.error("Project URL not set");
        return;
      }

      const response = await fetch(this.html_url);
      const data = await response.json();

      if (response.ok) {
        // Handle the data as needed
      } else {
        // Handle errors, e.g., display an error message or log the error
        console.error("Error fetching project details:", data.message);
      }
    },
    addToMyProjects() {
      // Save the project data to be displayed in userProfile.vue
      const projectExists = this.$store.state.userProjects.some(
        (project) => project.id === this.project.id
      );

      if (!projectExists) {
        const projectToAdd = {
          ...this.project,
          projectUrl: this.html_url // Add the project URL to the object
        };
        this.$store.dispatch("addUserProject", projectToAdd);
        this.projectAdded = true;
      }
    }
  },
  async created() {
    const projectId = this.$route.params.id;

    const projectFromStore = this.$store.state.userProjects.find(
      (project) => project.id === projectId
    );

    if (projectFromStore) {
      this.project = projectFromStore;
    } else {
      const response = await fetch(`https://api.github.com/repos/${projectId}`);
      const data = await response.json();

      this.project = {
        id: data.id, // Make sure to add the project id
        name: data.name,
        description: data.description,
        html_url: data.html_url,
        language: data.language,
        stargazers_count: data.stargazers_count,
        license: data.license,
        updated_at: data.updated_at,
        projectUrl: this.html_url
      };
    }

    this.fetchProjectDetails();
  }
};
</script>

<style scoped>
.project-container {
  display: flex;
  justify-content: center;
  padding: 32px;
}

.project {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 8px;
  padding: 24px;
  width: 80%;
  max-width: 480px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.project p {
  margin-bottom: 12px;
}

.project h1 {
  margin-bottom: 18px;
}

.project a {
  display: inline-block;
  margin-top: 16px;
  color: #42b983;
  text-decoration: none;
}

.project button {
  display: inline-block;
  margin-top: 12px;
  background-color: #42b983;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s ease;
}

.project button.project-added {
  background-color: #309079;
}

.project button:hover {
  background-color: #309079;
}
</style>
