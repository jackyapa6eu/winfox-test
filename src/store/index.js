// src/store/index.js
import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    booksList: [],
    searchQuery: '',
    orderBy: 'relevance',
    selectedCategory: 'all',
    startIndex: 0,
    maxResults: 40,
    loadingStatus: 'pending'
  },
  getters: {
    getBooksList: state => state.booksList,
    getOrderBy: state => state.orderBy,
    getSelectedCategory: state => state.selectedCategory,
    getSearchQuery: state => state.searchQuery,
    getStartIndex: state => state.startIndex,
    getMaxResults: state => state.maxResults,
    getLoadingStatus: state => state.loadingStatus
  },
  mutations: {
    setBooksList(state, newBooks) {
      state.booksList = newBooks;
    },
    appendBooks(state, newBooks) {
      state.booksList = [...state.booksList, ...newBooks];
    },
    setOrderBy(state, newOrderBy) {
      state.orderBy = newOrderBy;
    },
    setSelectedCategory(state, newCategory) {
      state.selectedCategory = newCategory;
    },
    setSearchQuery(state, newSearchQuery) {
      state.searchQuery = newSearchQuery;
    },
    setStartIndex(state, newStartIndex) {
      state.startIndex = newStartIndex;
    },
    setMaxResults(state, newMaxResults) {
      state.maxResults = newMaxResults;
    },
    setLoadingStatus(state, newLoadingStatus) {
      state.loadingStatus = newLoadingStatus;
    },
    resetPagination(state) {
      state.startIndex = 0;
      state.maxResults = 40;
    },
  },
  actions: {
    async fetchData({ commit, getters }) {
      const {getSearchQuery, getOrderBy, getSelectedCategory, getStartIndex, getMaxResults} = getters;
      try {
        commit('setLoadingStatus', 'loading');
        setTimeout(async () => { // Чтобы было видно loader
          const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
              key: 'AIzaSyAbIw3WqGnokIvvElDamzhHmpn8d5_KSzA',
              q: getSearchQuery,
              orderBy: getOrderBy,
              subject: getSelectedCategory !== 'all' ? getSelectedCategory : undefined,
              startIndex: getStartIndex,
              maxResults: getMaxResults
            },
          });
          if (getStartIndex === 0) {
            commit('setBooksList', response.data.items || []);
          } else {
            commit('appendBooks', response.data.items || []);
          }
          if (response.data?.items) {
            response.data?.items.forEach((item) => {
              console.log(item.volumeInfo?.imageLinks)
            })
          }

          commit('setLoadingStatus', 'done');
        }, 600)

      } catch (error) {
        commit('setLoadingStatus', 'error');
        console.error('Ошибка при запросе данных:', error);
      }
    },
    loadMore({ commit, state, dispatch }) {
      commit('setStartIndex', state.startIndex + state.maxResults);
      dispatch('fetchData');
    },
    resetPagination({ commit }) {
      commit('resetPagination');
    },
  }
});
