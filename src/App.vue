<template>
  <v-app>
    <NavBar />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "./components/NavBar.vue";
export default {
  name: "App",
  components: {
    NavBar,
  },
  data: () => ({
    debounceFunc: null
  }),
  mounted() {
    this.debounceFunc = () => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.setViewportHeight, 200);
    };
    window.addEventListener("resize", this.debounceFunc);

    this.setViewportHeight();
  },
  methods: {
    setViewportHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    },
  },
};
</script>
