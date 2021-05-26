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
    },
    addNewCollection(state, payload) {
      state.summaryCollectionData.unshift(payload);
    }
  },
  actions: {
    deleteCollection(context, collectionID) {
      context.commit('deleteCollection', collectionID);
    },
    addNewCollection(context, payload) {
      context.commit('addNewCollection', payload);
    }
  },
  getters: {
    getSummaryCollections(state) {
      return state.summaryCollectionData;
    } 
  }
})
