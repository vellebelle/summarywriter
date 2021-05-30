<template>
  <v-container>
    <h1 class="mb-5">Summary Collections</h1>

    <v-row>
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
import testData from '@/assets/summaryCollections'

export default {
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
      const collection = this.summaryCollections[collectionIndex];
      console.log(collection);
    }
  },
  computed: {
    summaryCollections() {
      return this.$store.getters.getSummaryCollections;
    },
  },
};
</script>
