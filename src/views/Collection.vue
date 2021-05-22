<template>
  <v-container fluid>
    <!-- <h1>Collection Title</h1> -->
    <v-row>
      <v-col>
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
        <v-btn @click="sortSources(testSources1)">Sort Test</v-btn>
      </v-col>
      <v-col>
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
              }}{{ currentlySelectedSummary.sources }}
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import collection from "../assets/test-data";
import _ from 'lodash';
export default {
  name: "Collection",
  data() {
    return {
      summaryCollection: collection,
      currentlySelectedSummary: null,
      testSources1: [
        { medium: "BT", pageNumber: "6", day: null },
        { medium: "BT", pageNumber: "12", day: null },
        { medium: "Information", pageNumber: "6", day: null },
        { medium: "Jyllands-Posten", pageNumber: "15", day: null },
        { medium: "Jyllands-Posten", pageNumber: "8", day: null },
        { medium: "Jyllands-Posten", pageNumber: "32", day: null },
        { medium: "Berlingske", pageNumber: "12", day: null },
        { medium: "Altinget", pageNumber: null, day: null },
      ],
      testSources2: [
        { medium: "BT", pageNumber: "6", day: "lørdag" },
        { medium: "BT", pageNumber: "12", day: "mandag" },
        { medium: "Information", pageNumber: "6", day: "søndag" },
        { medium: "Jyllands-Posten", pageNumber: "15", day: "mandag" },
        { medium: "Jyllands-Posten", pageNumber: "8", day: "mandag" },
        { medium: "Jyllands-Posten", pageNumber: "32", day: "lørdag" },
        { medium: "Berlingske", pageNumber: "12", day: "søndag" },
        { medium: "Altinget", pageNumber: null, day: "søndag" },
      ],
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
    sortSources(posts) {
      let summary = "";
      const groupedByMedium = _.groupBy(posts, "medium");
      _.map(groupedByMedium, (posts, medium) => {
        if (summary.length > 0) {
          summary += "; ";
        }

        summary += medium;

        let postsGroupedDay = _.groupBy(posts, "day");

        _.map(postsGroupedDay, (dayPosts, day) => {
          const pages = _.join(
            _.sortedUniq(_.map(dayPosts, (p) => p.pageNumber)),
            ", "
          );

          if (summary.length > 0 && (pages.length > 0 || day !== "null")) {
            summary += ", ";
          }

          if (day !== "null") {
            summary += day;
            if (pages.length > 0) {
              summary += ", ";
            }
          }

          if (pages.length > 0) {
            summary += `page ${pages}`;
          }
        });
      });
      console.log(summary);
      return summary;
    },
  },
  filters: {
    removeHTMLTags(value) {
      return value.replace(/(<([^>]+)>)/gi, "");
    },
    created() {},
  },
};
</script>
<style></style>

