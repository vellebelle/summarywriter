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
// import db from "@/firebase/init";
export default {
  name: "App",
  components: {
    NavBar,
  },
  data: () => ({
    debounceFunc: null,
  }),
  created() {
    // const allCollections = [];
    // db.collection("summaries").onSnapshot((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
        
    //     allCollections.push(doc.data());
    //   });
    //   this.$store.dispatch("setCollectionsFromDatabase", allCollections);
    //   console.log("UPDATED", querySnapshot);
    // });
  },
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
