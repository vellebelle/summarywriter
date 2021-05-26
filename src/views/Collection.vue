<template>
  <v-container fluid>
    <!-- <h1>Collection Title</h1> -->
  
    <v-row>
      <v-col class="full-height-container">
        <v-list three-line>
          <template v-for="summary in summaryCollection">
            <v-list-item :key="summary.title" @click="displaySummary(summary)">
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
      </v-col>
      <v-col class="full-height-container">
        <div v-if="currentlySelectedSummary">
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
import collection from '@/assets/test-data';
import sortSources from '@/mixins/sortSources';
export default {
  mixins: [sortSources],
  name: "Collection",
  data() {
    return {
      summaryCollection: collection,
      currentlySelectedSummary: null
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
    }
  },
  filters: {
    removeHTMLTags(value) {
      return value.replace(/(<([^>]+)>)/gi, "");
    },
    created() {},
  },
};
</script>
<style>
.full-height-container {
  height: calc(calc(var(--vh, 1vh) * 100) - 64px)!important;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
