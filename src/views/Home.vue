<template>
  <v-container>
    <h1 class="mb-5">Summary Collections</h1>

    <v-row>
      <v-col v-if="!summaryCollections.length">

        <h2 class="h2 text-center">Der er ingen summary collections</h2>
        <p class="h3 text-center"> Tilføj en ny samling ved at klikke på det røde plus</p>
      </v-col>
      <v-col
        v-for="(collection, index) in summaryCollections"
        :key="collection.title"
      >
        <v-card color="indigo lighten-1" dark elevation="2">
          <v-card-title v-text="collection.title"></v-card-title>
          <v-card-text>
            <div>Dato: {{ collection.date }}</div>
            <div>Antal: {{ collection.summaries.length }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn text @click="downloadWordFile(index)">
              <v-icon class="mr-2">mdi-download</v-icon>
              Download
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="deleteCollection(index)" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn @click="editCollection(index)" icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-btn @click="addTestData">Add test data</v-btn>

    <Confirm ref="confirm"> </Confirm>

    <!-- Dialog for create new collection  -->
    <v-dialog v-model="createNewCollectionDialog" persistent max-width="400px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab dark color="red" fixed right bottom v-bind="attrs" v-on="on">
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Opret ny resumésamling</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="collectionTitleForm"
            v-model="collectionTitleFormValid"
            lazy-validation
          >
            <v-text-field
              v-model="newCollectionTitle"
              label="Titel"
              :rules="collectionTitleRules"
              required
            ></v-text-field>
          </v-form>

          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="newCollectionDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="newCollectionDate"
                label="Dato"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="newCollectionDate" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(newCollectionDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="indigo darken-1"
            text
            @click="createNewCollectionDialog = false"
          >
            Luk
          </v-btn>
          <v-btn color="indigo darken-1" text @click="createNewCollection">
            Opret
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { createUID } from "@/assets/createUniqueID";
import Confirm from "@/components/Confirm.vue";
import testData from "@/assets/summaryCollections";
import sortSources from "@/mixins/sortSources";
import { saveAs } from "file-saver";
// const htmlDocx = require('html-docx.js');
export default {
  mixins: [sortSources],
  name: "Home",
  components: {
    Confirm: Confirm,
  },
  data() {
    return {
      createNewCollectionDialog: false,
      newCollectionTitle: null,
      newCollectionDate: new Date().toISOString().substr(0, 10),
      menu: false,
      collectionTitleFormValid: true,
      collectionTitleRules: [(v) => !!v || "Indtast en titel"],
      allSummaries: "",
      convertedSummary: null,
    };
  },
  methods: {
    deleteCollection(index) {
      this.$refs.confirm
        .open("Slet kollektion?", "Er du sikker? Der er ingen vej tilbage..", {
          color: "indigo",
          resolveButtonText: "Slet",
          rejectButtonText: "Fortryd",
          width: 400,
        })
        .then((confirm) => {
          if (confirm) {
            this.$store.dispatch("deleteCollection", index);
          }
        });
    },
    setClickedCollectionItemID(collectionID) {
      this.clickedCollectionItemID = collectionID;
      console.log(this.clickedCollectionItemID);
    },
    createNewCollection() {
      if (this.$refs.collectionTitleForm.validate()) {
        const newCollection = {
          id: createUID(),
          title: this.newCollectionTitle,
          date: this.newCollectionDate,
          summaries: [],
        };
        this.$store.dispatch("addNewCollection", newCollection);
        // Set the selected collection ID to 0 because its added to the top of the array
        this.$store.dispatch("setCurrentlySelectedCollectionID", 0);
        this.createNewCollectionDialog = false;
        this.$router.push("Collection");
      }
    },
    editCollection(index) {
      console.log("Edit collection");
      this.$store.dispatch("setCurrentlySelectedCollectionID", index);
      this.$router.push("Collection");
    },
    addTestData() {
      testData.forEach((collection) => {
        this.$store.dispatch("addNewCollection", collection);
      });
    },
    downloadWordFile(collectionIndex) {
      // REMEMBER TO SORT SO TOP STORIES ARE ON THE TOP, THEN PRIO AND ANDRE
      this.allSummaries = "";
      const header = "<html><head><meta charset='utf-8'></head><body>";
      const footer = "</body></html>";

      let topCounter = 0;
      let prioCounter = 0;
      let otherCounter = 0;

      const topStoriesStr =
        "<strong><u/>Dagens EU-tophistorier</u></strong><br><br>";
      const prioStoriesStr =
        "<strong><u/>Andre EU-historier: Prioriterede emner</u></strong><br><br>";
      const otherStoriesStr =
        "<strong><u/>Andre EU-historier</u></strong><br><br>";

      const collection = this.summaryCollections[collectionIndex].summaries.sort((a,b) => {
        return (a.profile > b.profile ? 1 : -1);
      });

      collection.forEach((item) => {
        // Check for number of different profile occurances
        if (item.profile === "1") {
          topCounter++;
        }
        if (item.profile === "2") {
          prioCounter++;
        }
        if (item.profile === "3") {
          otherCounter++;
        }

        let sources = this.sortSources(item.sources);
        console.log(item.profile);
        const textContent = item.summary
          .replaceAll("&nbsp;", "")
          .replaceAll("<div>", "<br>")
          .replaceAll("</div>", "");

        const fullSummary = `${
          item.profile === "1" && topCounter === 1
            ? topStoriesStr
            : ""
        }
        ${
          item.profile === "2" && prioCounter === 1
            ? prioStoriesStr
            : ""
        }
        ${
          item.profile === "3" && otherCounter === 1
            ? otherStoriesStr
            : ""
        }
        <strong>${item.category}: ${
          item.title
        }</strong>${textContent}<br><em>${sources}</em><br><br>`;
        this.allSummaries += fullSummary;
      });
      const allSummariesDocument = `${header}${this.allSummaries}${footer}`;
      const convertedSummariesDocument = window.htmlDocx.asBlob(
        allSummariesDocument
      );
      saveAs(convertedSummariesDocument, "filename.docx");
    },
  },
  computed: {
    summaryCollections() {
      return this.$store.getters.getSummaryCollections;
    },
  },
};
</script>
