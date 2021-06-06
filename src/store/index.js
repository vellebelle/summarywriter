import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
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
    },
    setCurrentlySelectedCollectionID(state, payload) {
      state.currentlySelectedCollectionID = payload;
    },
    addSingleSummaryToCollection(state, payload) {
      state.summaryCollectionData[state.currentlySelectedCollectionID].summaries.push(payload);
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
      return state.summaryCollectionData[state.currentlySelectedCollectionID].title;
    }
  },
  plugins: [vuexPersist.plugin],
});
