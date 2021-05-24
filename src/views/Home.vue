<template>
  <v-container>
    <h1 class="mb-5">Summary Collections</h1>
    <v-btn fab dark color="indigo" fixed right bottom>
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>
    <v-row>
      
      <v-col v-for="collection in summaryCollections" :key="collection.title">
        
        <v-card color="blue-grey" dark elevation="2">
          <v-card-title v-text="collection.title"></v-card-title>
          <v-card-text>
            <div>Dato: {{ collection.date }}</div>
            <div>Antal: {{ collection.summaries.length }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn text>
              <v-icon class="mr-2">mdi-download</v-icon>
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
