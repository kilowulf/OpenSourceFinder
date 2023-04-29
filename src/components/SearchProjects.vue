<template>
  <div class="recommended-container">
    <ul>
      <h2>Recommended Projects</h2>
      <div class="projects">
        <div
          v-for="(project, index) in recommendedProjects"
          :key="index"
          class="project"
        >
          <h3>{{ project.name }}</h3>
          <p>{{ project.description }}</p>
          <a :href="project.html_url" target="_blank" class="view-on-github"
            >View on GitHub</a
          >
        </div>
      </div>
    </ul>
  </div>

  <div class="search-container">
    <h1>Search Projects</h1>
    <h2>Filters</h2>
    <form @submit.prevent="search">
      <div class="filters-container">
        <div class="filter-item">
          <h3>Language</h3>
          <div
            class="checkbox-container"
            v-for="lang in languageOptions"
            :key="lang.value"
          >
            <input
              type="checkbox"
              v-model="filters.language"
              :value="lang.value"
              id="language-{{ lang.value }}"
            />
            <label :for="'language-' + lang.value">{{ lang.label }}</label>
          </div>
        </div>
        <div class="filter-item">
          <h3>Labels</h3>
          <div
            class="checkbox-container"
            v-for="label in labelOptions"
            :key="label.value"
          >
            <input
              type="checkbox"
              v-model="filters.labels"
              :value="label.value"
              id="label-{{ label.value }}"
            />
            <label :for="'label-' + label.value">{{ label.label }}</label>
          </div>
        </div>
        <div class="filter-item">
          <h3>Frameworks</h3>
          <div
            class="checkbox-container"
            v-for="framework in frameworkOptions"
            :key="framework.value"
          >
            <input
              type="checkbox"
              v-model="filters.frameworks"
              :value="framework.value"
              id="framework-{{ framework.value }}"
            />
            <label :for="'framework-' + framework.value">{{
              framework.label
            }}</label>
          </div>
        </div>
      </div>
      <button type="submit" class="search-button">Search</button>
      <!-- Results section -->
      <div class="results-container">
        <h2>Results</h2>
        <ul v-if="projects.length" class="projects-list">
          <li v-for="project in projects" :key="project.id" class="project">
            <router-link
              :to="{ name: 'Project', params: { id: project.full_name } }"
              class="project-link"
            >
              <h3>Project: {{ project.name }}</h3>
            </router-link>
            <p>
              No. of Contributors: {{ project.contributors_count }}<br />
              Most recent contribution: {{ project.updated_at | formatDate }}
            </p>
          </li>
        </ul>

        <p v-else>No projects found.</p>
        <div class="pagination-wrapper">
          <div class="pagination-container">
            <button :disabled="page <= 1" @click.prevent="previousPage">
              Previous
            </button>
            <button :disabled="page >= totalPages" @click.prevent="nextPage">
              Next
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import axios from "axios";

export default {
  name: "SearchProjects",

  data() {
    return {
      props: {
        projectsData: {
          type: Object
        }
      },
      recommendedProjects: [],

      filters: {
        language: [],
        labels: [],
        frameworks: []
      },
      projects: [],
      page: 1,
      totalPages: 1,
      languageOptions: [
        { label: "JavaScript", value: "javascript" },
        { label: "Python", value: "python" },
        { label: "HTML", value: "html" }
      ],
      labelOptions: [
        { label: "Help Wanted", value: "help-wanted" },
        { label: "Good First Issue", value: "good-first-issue" },
        { label: "Bugs", value: "bugs" },
        { label: "Enhancements", value: "enhancements" }
      ],
      frameworkOptions: [
        { label: "React", value: "react" },
        { label: "Vue", value: "vue" },
        { label: "Angular", value: "angular" }
      ]
    };
  },
  setup() {
    const store = useStore();
    const recommendedProjects = computed(() => store.getters.getProjectsData);
    const projects = ref(store.getters.getSearchResults);

    // Watch for search results changes in the Vuex store
    watch(
      () => store.getters.getSearchResults,
      (newResults) => {
        projects.value = newResults;
      }
    );

    return {
      recommendedProjects,
      projects
    };
  },
  computed: {
    chartData() {
      if (
        this.recommendedProjects.value &&
        this.recommendedProjects.value.length > 0
      ) {
        const contributions = this.recommendedProjects.value.map(
          (project) => project.contributions
        );
        return {
          contributions
        };
      } else {
        return {
          contributions: []
        };
      }
    }
  },

  methods: {
    async search() {
      try {
        const response = await axios.post(
          "http://localhost:3000/search",
          this.filters
        );
        this.projects = response.data;
        this.totalPages = Math.ceil(response.data.total_count / 10);
        this.$store.dispatch("updateSearchResults", this.projects);
        this.$store.dispatch("setProjectUrl", response.data.html_url);
      } catch (error) {
        console.error(error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    },
    selectProject(project) {
      // ...
      this.$store.dispatch("addUserProject", {
        ...project,
        selected: true // Add this line
      });
    },
    buildQueryParams() {
      const params = new URLSearchParams();
      params.append("page", this.page);
      if (this.filters.language.length) {
        params.append("language", this.filters.language.join(","));
      }
      if (this.filters.labels.length) {
        params.append("labels", this.filters.labels.join(","));
      }
      if (this.filters.frameworks.length) {
        params.append("frameworks", this.filters.frameworks.join(","));
      }
      return params.toString();
    },
    previousPage() {
      this.page--;
      this.search();
    },
    nextPage() {
      this.page++;
      this.search();
    }
  }
};
</script>

<style scoped>
.recommended-container {
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 30px;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
}
.search-button {
  background-color: #3f51b5;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 30px;
  transition: all 0.3s ease-in-out;
}

.search-button:hover {
  background-color: #283593;
}

h1,
h2,
h3 {
  margin-bottom: 20px;
}

h1 {
  font-size: 36px;
}

h2 {
  font-size: 24px;
}

h3 {
  font-size: 18px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

.filters-container {
  display: flex;
  align-items: flex-start;

  flex-wrap: wrap;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 5px;
}

.filter-item {
  border: 1px solid #ccc;
  padding: 20px;
}

.filter-item h3 {
  margin-top: 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
}

.checkbox-container label {
  margin-bottom: 0;
  margin-left: 10px;
}

.checkbox-container input[type="checkbox"] {
  margin-right: 10px;
}

.results-container {
  margin-top: 20px;
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
  margin-top: 15px;
}

.pagination-container {
  display: inline-flexbox;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}
.pagination-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

button {
  background-color: #3f51b5;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.3s ease-in-out;
}

button:hover {
  background-color: #283593;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.projects {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}

.project {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: calc(100% - 16px);
  max-width: 240px;
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.project:hover {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.project h3 {
  margin: 0;
  margin-bottom: 8px;
  font-size: 18px;
}

.project p {
  flex-grow: 1;
  margin: 0;
  margin-bottom: 8px;
  font-size: 14px;
}

.view-on-github {
  text-decoration: none;
  color: #ffffff;
  background-color: #3f51b5;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.view-on-github:hover {
  background-color: #283593;
}

.view-on-github {
  text-decoration: none;
  color: #ffffff;
  background-color: #3f51b5;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.view-on-github:hover {
  background-color: #283593;
}
</style>
