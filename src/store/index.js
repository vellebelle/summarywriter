import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import db from '@/firebase/init.js';
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
    summaryBeingEditedIndex: null
  },
  mutations: {
    deleteCollection(state, collectionID) {
      state.summaryCollectionData.splice(collectionID, 1);
    },
    addNewCollection(state, payload) {
      state.summaryCollectionData.unshift(payload);
      // Create new collection in database

      db.collection("summaries").doc(payload.id).set(payload)
      .then(() => {
        console.log('Document written');
      }).catch((err) => {
        console.error(err);
      });
    },
    setCurrentlySelectedCollectionID(state, payload) {
      state.currentlySelectedCollectionID = payload;
    },
    addSingleSummaryToCollection(state, payload) {
      state.summaryCollectionData[state.currentlySelectedCollectionID].summaries.unshift(payload);
      // Add summary to database
      db.runTransaction(t => {
        const ref = db.collection('summaries').doc(state.summaryCollectionData[state.currentlySelectedCollectionID].id);
        console.log(ref);
        return t.get(ref).then(doc => {
          const arrayData = doc.data()['summaries'];
          // Mutate array data
          arrayData.unshift(payload);
          // re-add array to db
          t.update(ref, {['summaries']: arrayData});
        });
      }).then(() => {
        console.log('Added to collection');
      }).catch((err) => {
        console.error('Failed to add', err);
      })
    },
    replaceSingleSummaryInCollection(state, payload) {
      
      state.summaryCollectionData[state.currentlySelectedCollectionID].summaries.splice(state.summaryBeingEditedIndex, 1, payload);
    },
    deleteSummaryFromCollection(state, payload) {
      state.summaryCollectionData[
        state.currentlySelectedCollectionID
      ].summaries.splice(payload, 1);
    },
    setIsEditingSummary(state, payload) {
      state.isEditingSummary = payload;
    },
    setSummaryBeingEdited(state, summary) {
      state.summaryBeingEdited = summary;
    },
    setSummaryBeingEditedIndex(state, summaryIndex) {
      state.summaryBeingEditedIndex = summaryIndex;
    }
  },
  actions: {
    deleteCollection(context, collectionID) {
      context.commit("deleteCollection", collectionID);
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
      context.commit('replaceSingleSummaryInCollection', payload);
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
      context.commit('setSummaryBeingEditedIndex', summaryIndex);
    }
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
      if (state.summaryCollectionData[state.currentlySelectedCollectionID].title) {
        return state.summaryCollectionData[state.currentlySelectedCollectionID].title;
      } else {
        return 'ddd';
      }
      
    }
  },
  plugins: [vuexPersist.plugin],
});
