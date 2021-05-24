<template>
  <v-container>
    <h1 class="mb-5">All Collections</h1>
    <v-row>
      <v-col v-for="collection in summaryCollections" :key="collection.title">
        <v-card>
          <v-card-title v-text="collection.title"></v-card-title>
          <v-card-text>
            <v-row>
              <v-col> Dato: {{ collection.date }} </v-col>
              <v-col> Antal: {{ collection.summaries.length }} </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
             <v-btn text>
              <v-icon  class="mr-2">mdi-download</v-icon>
              Download
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",

  components: {},
  data() {
    return {};
  },
  computed: {
    summaryCollections() {
      return this.$store.getters.getSummaryCollections;
    },
  },
};
</script>
