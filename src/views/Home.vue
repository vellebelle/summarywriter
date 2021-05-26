<template>
  <v-container>
    <h1 class="mb-5">Summary Collections</h1>

    <v-row>
      <v-col v-for="(collection, index) in summaryCollections" :key="collection.title">
        <v-card color="indigo lighten-1" dark elevation="2">
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
            <v-btn @click="showDeleteCollectionDialog = true, setClickedCollectionItemID(index)" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn @click="setClickedCollectionItemID(index), editCollection()" icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Dialog for delete collection -->
   <v-dialog v-model="showDeleteCollectionDialog" max-width="400px">
     <v-card>
       <v-card-title>Delete Collection?</v-card-title>
       <v-card-text>
         Do you really want to delete this collection? It will be lost forever.. and ever....
       </v-card-text>
       <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="indigo darken-1" text @click="showDeleteCollectionDialog = false">
            Cancel
          </v-btn>
          <v-btn color="red" text @click="deleteCollection">
            Delete
          </v-btn>
         </v-card-actions>
     </v-card>
   </v-dialog>


    <!-- Dialog for create new collection  -->
    <v-dialog v-model="createNewCollectionDialog" persistent max-width="400px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          color="red"
          fixed
          right
          bottom
          v-bind="attrs"
          v-on="on"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Opret ny collection</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newCollectionTitle"
            label="Collection Title"
            required
          ></v-text-field>
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
        <v-date-picker
          v-model="newCollectionDate"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu = false"
          >
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
          <v-btn color="indigo darken-1" text @click="createNewCollectionDialog = false">
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
import { createUID } from '@/assets/createUniqueID.js';
export default {
  name: "Home",
  data() {
    return {
      createNewCollectionDialog: false,
      newCollectionTitle: null,
      newCollectionDate: new Date().toISOString().substr(0, 10),
      showDeleteCollectionDialog: false,
      menu: false,
      clickedCollectionItemID: null
    };
  },
  methods: {
    deleteCollection() {
      this.showDeleteCollectionDialog = false;
      this.$store.dispatch("deleteCollection", this.clickedCollectionItemID);
    },
    setClickedCollectionItemID(collectionID) {
      this.clickedCollectionItemID = collectionID;
      console.log(this.clickedCollectionItemID);
    },
    createNewCollection() {
      console.log('create');
      const newCollection = {
        id: createUID(),
        title: this.newCollectionTitle,
        date: this.newCollectionDate,
        summaries: []
      }
      this.$store.dispatch('addNewCollection', newCollection);
      this.createNewCollectionDialog = false
    },
    editCollection() {
      console.log('Edit collection');
      this.$store.dispatch('setCurrentlySelectedCollectionID', this.clickedCollectionItemID);
      this.$router.push('Collection');
    }
  },
  computed: {
    summaryCollections() {
      return this.$store.getters.getSummaryCollections;
    },
  },
};
</script>
