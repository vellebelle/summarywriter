<template>
  <v-container fluid>
    <v-col v-if="!summaries.length">
        <h2 class="h2 text-center">Der er ingen resumeer i denne samling</h2>
        <p class="h3 text-center"> Tilføj ved at klikke på det røde plus</p>
      </v-col>
    <v-row>
      
      <v-col class="full-height-container pa-0">
        <v-list three-line>
          <template v-for="(summary, index) in summaries">
            <v-list-item
              :key="summary.title"
              @click="displaySummary(summary)"
              :class="{
                prio: summary.profile === '2',
                top: summary.profile === '1',
              }"
            >
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
          <span>Profil: {{ profiles[currentlySelectedSummary.profile] }}</span>
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
    <Confirm ref="confirm"> </Confirm>
  </v-container>
</template>
<script>
import collection from "@/assets/test-data";
import sortSources from "@/mixins/sortSources";
import Confirm from "@/components/Confirm.vue";
export default {
  mixins: [sortSources],
  name: "Collection",
  components: {
    Confirm: Confirm,
  },
  data() {
    return {
      profiles: {
        '1': 'Dagens EU-tophistorier',
        '2': 'Andre EU-historier: Prioriterede emner',
        '3': 'Andre EU-historier'
      },
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
      this.$refs.confirm
        .open("Slet resume?", "Er du sikker? Der er ingen vej tilbage..", {
          color: "indigo",
          resolveButtonText: "Slet",
          rejectButtonText: "Fortryd",
          width: 400,
        })
        .then((confirm) => {
          if (confirm) {
            this.$store.dispatch("deleteSummaryFromCollection", index);
          }
        });
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
      return collectionSummaries.sort((a,b) => {
        
        return (a.profile > b.profile ? 1 : -1);
      });
    },
  },
  filters: {
    removeHTMLTags(value) {
      return value.replace(/(<([^>]+)>)/gi, "");
    },
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
