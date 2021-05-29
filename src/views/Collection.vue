<template>
  <v-container fluid>

    <v-row>
      <v-col class="full-height-container pa-0">
        <v-list three-line>
          <template v-for="(summary, index) in summaries">
            <v-list-item :key="index" @click="displaySummary(summary)" :class="{ prio: summary.profile === 'Prioriterede emner', top: summary.profile === 'Tophistorier' }">
              <v-list-item-content>
                <v-list-item-title>{{ summary.title }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  summary.summary | removeHTMLTags
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action class="flex-row">
                <v-btn icon @click="deleteSummary(index)">
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
            <v-divider :key="index"></v-divider>
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
    deleteSummary(index) {
      console.log("Delete Summary");
      this.$store.dispatch('deleteSummaryFromCollection', index);
    },
    editSummary() {
      console.log("Edit Summary");
    },
    addSummary() {
      this.$router.push("Add");
    },
  },
  computed: {
    summaries() {
      let collection = this.$store.getters.getSummaryCollections;
      let collectionSummaries = collection[this.$store.getters.getCurrentlySelectedCollectionID].summaries;
      return collectionSummaries.sort((a) => {
        if (a.profile === 'Tophistorier') {
          return -2;
        } else if (a.profile === "Prioriterede emner") {
          return -1;
        }
      });
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
.top {
  background-color: #fff9da;
}
.prio {
  background-color: rgb(236, 236, 236);
}
</style>
