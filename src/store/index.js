import Vue from 'vue'
import Vuex from 'vuex'
import testData from '../assets/summaryCollections';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    summaryCollectionData: testData,
    currentlySelectedCollectionID: null
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
    }
  },
  actions: {
    deleteCollection(context, collectionID) {
      context.commit('deleteCollection', collectionID);
    },
    addNewCollection(context, payload) {
      context.commit('addNewCollection', payload);
    },
    setCurrentlySelectedCollectionID(context, payload) {
      context.commit('setCurrentlySelectedCollectionID', payload);
    }
  },
  getters: {
    getSummaryCollections(state) {
      return state.summaryCollectionData;
    } ,
    getCurrentlySelectedCollectionID(state) {
      return state.currentlySelectedCollectionID;
    }
  }
})
