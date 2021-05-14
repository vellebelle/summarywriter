<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <h3 class="headline">
        <span class="font-weight-bold">Summary</span
        ><span class="font-weight-light"></span>Writer
      </h3>
    </div>

    <v-spacer></v-spacer>

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
