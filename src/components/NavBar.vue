<template>
  <v-app-bar app color="indigo" dark>
    <div class="d-flex align-center">
    <router-link to="/" class="router-link">
      <h3 class="headline white--text">
        <span class="font-weight-bold">Summary</span
        ><span class="font-weight-light"></span>Writer
      </h3>
    </router-link>
      
    </div>

    <v-spacer></v-spacer>
<v-btn to="/collection" text>
      Collection
    </v-btn>
    <v-btn to="/add" text>
      add
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "NavBar",
};
</script>
<style>

a.router-link {
  text-decoration: none;
}

</style>