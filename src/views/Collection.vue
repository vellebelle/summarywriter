<template>
  <v-container fluid>

    <v-row>
      <v-col class="full-height-container">
        <v-list three-line>
          <template v-for="(summary, index) in summaries">
            <v-list-item :key="index" @click="displaySummary(summary)">
              <v-list-item-content>
                <v-list-item-title>{{ summary.title }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  summary.summary | removeHTMLTags
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action class="flex-row">
                <v-btn icon @click="deleteSummary">
                  <v-icon color="grey lighten-1">
                    mdi-delete
                  </v-icon></v-btn
                >
                <v-btn icon @click="editSummary">
                  <v-icon color="grey lighten-1">
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
        <v-btn fab dark color="red" fixed bottom right @click="addSummary">
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
      <v-col class="full-height-container">
        <div v-if="currentlySelectedSummary">
          <span>Profil: {{ currentlySelectedSummary.profile }}</span>
          <h3 class="mb-3">
            {{ currentlySelectedSummary.category }}:
            {{ currentlySelectedSummary.title }}
          </h3>
          <div class="mb-3" v-html="currentlySelectedSummary.summary"></div>
          <div>
            <p>
              {{
                currentlySelectedSummary.sources.length > 1
                  ? "Kilder: "
                  : "Kilde: "
              }}{{ sortSources(currentlySelectedSummary.sources) }}
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import collection from "@/assets/test-data";
import sortSources from "@/mixins/sortSources";
export default {
  mixins: [sortSources],
  name: "Collection",
  data() {
    return {
      summaryCollection: collection,
      currentlySelectedSummary: null,
      collectionID: null,
    };
  },
  methods: {
    displaySummary(summary) {
      this.currentlySelectedSummary = summary;
    },
    deleteSummary() {
      console.log("Delete Summary");
    },
    editSummary() {
      console.log("Edit Summary");
    },
    testSummary() {
      let collection = this.$store.getters.getSummaryCollections;
      let selectedID = this.$store.getters.getCurrentlySelectedCollectionID;
      console.log(selectedID);
      console.log(collection[0].summaries);
    },
    addSummary() {
      this.$router.push("Add");
    },
  },
  computed: {
    summaries() {
      let collection = this.$store.getters.getSummaryCollections;
      return collection[this.$store.getters.getCurrentlySelectedCollectionID].summaries;
    },
  },
  filters: {
    removeHTMLTags(value) {
      return value.replace(/(<([^>]+)>)/gi, "");
    }
  },
};
</script>
<style>
.full-height-container {
  height: calc(calc(var(--vh, 1vh) * 100) - 64px) !important;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
