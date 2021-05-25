import Vue from 'vue'
import Vuex from 'vuex'
import testData from '../assets/summaryCollections';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    summaryCollectionData: testData
  },
  mutations: {
    deleteCollection(state, collectionID) {
      state.summaryCollectionData.splice(collectionID, 1);
    }
  },
  actions: {
    deleteCollection(context, collectionID) {
      context.commit('deleteCollection', collectionID);
    }
  },
  getters: {
    getSummaryCollections(state) {
      return state.summaryCollectionData;
    } 
  }
})
