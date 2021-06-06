<template>
  <v-app-bar app color="indigo" dark>
    <v-btn icon v-show="routeName !== 'Home'" @click="$router.push('/')">
      <v-icon>mdi-home</v-icon>
    </v-btn>
   <v-toolbar-title v-show="routeName !== 'Home'">{{currentCollectionTitle}}</v-toolbar-title>
   <v-spacer></v-spacer>
      <h3 class="headline white--text">
        <span class="font-weight-bold">Summary</span>
        <span class="font-weight-light"></span>Writer
      </h3>
  
  </v-app-bar>
</template>

<script>
export default {
  name: "NavBar",
  computed: {
    routeName() {
      return this.$route.name;
    },
    currentCollectionTitle() {
      return this.$store.getters.getCurrentCollectionTitle;
    }
  }
};
</script>
<style>

a.router-link {
  text-decoration: none;
}

</style>