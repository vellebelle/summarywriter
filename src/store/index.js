import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import db from "@/firebase/init.js";
// import testData from '../assets/summaryCollections';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: "summarywriter",
  storage: localStorage,
  reducer: (state) => ({
    summaryCollectionData: state.summaryCollectionData,
    currentlySelectedCollectionID: state.currentlySelectedCollectionID,
  }),
});

export default new Vuex.Store({
  state: {
    summaryCollectionData: [],
    currentlySelectedCollectionID: null,
    isEditingSummary: false,
    summaryBeingEdited: null,
    summaryBeingEditedIndex: null,
  },
  mutations: {
    deleteCollection(state, collectionIndex) {
      const collectionID = state.summaryCollectionData[collectionIndex].id;
      // delete from store
      state.summaryCollectionData.splice(collectionIndex, 1);
      // delete from db
      db.collection("summaries")
        .doc(collectionID)
        .delete()
        .then(() => {
          console.log("Collection was deleted");
        })
        .catch((err) => {
          console.error("There was an error deleting the document", err);
        });
    },
    addNewCollection(state, payload) {
      state.summaryCollectionData.push(payload);
      // Create new collection in database

      db.collection("summaries")
        .doc(payload.id)
        .set(payload)
        .then(() => {
          console.log("Document written");
        })
        .catch((err) => {
          console.error(err);
        });
    },
    setCurrentlySelectedCollectionID(state, payload) {
      state.currentlySelectedCollectionID = payload;
    },
    addSingleSummaryToCollection(state, payload) {
      state.summaryCollectionData[
        state.currentlySelectedCollectionID
      ].summaries.push(payload);
      // Add summary to database
      db.runTransaction((t) => {
        const ref = db
          .collection("summaries")
          .doc(
            state.summaryCollectionData[state.currentlySelectedCollectionID].id
          );
        console.log(ref);
        return t.get(ref).then((doc) => {
          const arrayData = doc.data()["summaries"];
          // Mutate array data
          arrayData.push(payload);
          // re-add array to db
          t.update(ref, { ["summaries"]: arrayData });
        });
      })
        .then(() => {
          console.log("Added to collection");
        })
        .catch((err) => {
          console.error("Failed to add", err);
        });
    },
    replaceSingleSummaryInCollection(state, payload) {
      state.summaryCollectionData[
        state.currentlySelectedCollectionID
      ].summaries.splice(state.summaryBeingEditedIndex, 1, payload);

      // Replace summary to database
      db.runTransaction((t) => {
        const ref = db
          .collection("summaries")
          .doc(
            state.summaryCollectionData[state.currentlySelectedCollectionID].id
          );
        
        return t.get(ref).then((doc) => {
          const arrayData = doc.data()["summaries"];
          // Mutate array data
          arrayData.splice(state.summaryBeingEditedIndex, 1, payload);
          // re-add array to db
          t.update(ref, { ["summaries"]: arrayData });
        });
      })
        .then(() => {
          console.log("Added to collection");
        })
        .catch((err) => {
          console.error("Failed to add", err);
        });
    },
    deleteSummaryFromCollection(state, payload) {
      state.summaryCollectionData[
        state.currentlySelectedCollectionID
      ].summaries.splice(payload, 1);

      db.runTransaction((t) => {
        const ref = db
          .collection("summaries")
          .doc(
            state.summaryCollectionData[state.currentlySelectedCollectionID].id
          );
        // console.log(ref);
        return t.get(ref).then((doc) => {
          const arrayData = doc.data()["summaries"];
          // Mutate array data
          arrayData.splice(payload, 1);
          // re-add array to db
          t.update(ref, { ["summaries"]: arrayData });
        });
      })
        .then(() => {
          console.log("Added to collection");
        })
        .catch((err) => {
          console.error("Failed to add", err);
        });
    },
    setIsEditingSummary(state, payload) {
      state.isEditingSummary = payload;
    },
    setSummaryBeingEdited(state, summary) {
      state.summaryBeingEdited = summary;
    },
    setSummaryBeingEditedIndex(state, summaryIndex) {
      state.summaryBeingEditedIndex = summaryIndex;
    },
  },
  actions: {
    deleteCollection(context, collectionIndex) {
      context.commit("deleteCollection", collectionIndex);
    },
    addNewCollection(context, payload) {
      context.commit("addNewCollection", payload);
    },
    setCurrentlySelectedCollectionID(context, payload) {
      context.commit("setCurrentlySelectedCollectionID", payload);
    },
    addSingleSummaryToCollection(context, payload) {
      context.commit("addSingleSummaryToCollection", payload);
    },
    replaceSingleSummaryInCollection(context, payload) {
      context.commit("replaceSingleSummaryInCollection", payload);
    },
    deleteSummaryFromCollection(context, payload) {
      context.commit("deleteSummaryFromCollection", payload);
    },
    setIsEditingSummary(context, payload) {
      context.commit("setIsEditingSummary", payload);
    },
    setSummaryBeingEdited(context, summary) {
      context.commit("setSummaryBeingEdited", summary);
    },
    setSummaryBeingEditedIndex(context, summaryIndex) {
      context.commit("setSummaryBeingEditedIndex", summaryIndex);
    },
  },
  getters: {
    getSummaryCollections(state) {
      return state.summaryCollectionData;
    },
    getCurrentlySelectedCollectionID(state) {
      return state.currentlySelectedCollectionID;
    },
    getIsEditingSummary(state) {
      return state.isEditingSummary;
    },
    getSummaryBeingEdited(state) {
      return state.summaryBeingEdited;
    },
    getSummaryBeingEditedIndex(state) {
      return state.summaryBeingEditedIndex;
    },
    getCurrentCollectionTitle(state) {
      if (state.summaryCollectionData.length) {
        return state.summaryCollectionData[state.currentlySelectedCollectionID]
          .title;
      } else {
        return "";
      }
    },
  },
  plugins: [vuexPersist.plugin],
});
