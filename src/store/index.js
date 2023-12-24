// src/store/index.js
import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    booksList: [],
    booksObject: {},
    openedBook: null,
    baseUrl: 'https://www.googleapis.com/books/v1/volumes/',
    apiKey: 'AIzaSyAbIw3WqGnokIvvElDamzhHmpn8d5_KSzA',
    searchQuery: '',
    orderBy: 'relevance',
    selectedCategory: 'all',
    startIndex: 0,
    maxResults: 40,
    allBooksLoadingStatus: 'pending',
    oneBookLoadingStatus: 'pending'
  },
  getters: {
    getBaseUrl: state => state.baseUrl,
    getApiKey: state => state.apiKey,
    getBooksList: state => state.booksList,
    getBooksObject: state => state.booksObject,
    getOpenedBook: state => state.openedBook,
    getOrderBy: state => state.orderBy,
    getSelectedCategory: state => state.selectedCategory,
    getSearchQuery: state => state.searchQuery,
    getStartIndex: state => state.startIndex,
    getMaxResults: state => state.maxResults,
    getAllBooksLoadingStatus: state => state.allBooksLoadingStatus,
    getOneBookLoadingStatus: state => state.oneBookLoadingStatus
  },
  mutations: {
    setBooksList(state, newBooks) {
      state.booksList = newBooks;
    },
    setBooksObject(state, newBooks) {
      state.booksObject = newBooks.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc
      }, {})
    },
    setOpenedBook(state, openedBook) {
      state.openedBook = openedBook;
    },
    appendBooks(state, newBooks) {
      state.booksList = [...state.booksList, ...newBooks];
      state.booksObject = newBooks.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, JSON.parse(JSON.stringify(state.booksObject)));
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
    setAllBooksLoadingStatus(state, newLoadingStatus) {
      state.allBooksLoadingStatus = newLoadingStatus;
    },
    setOneBookLoadingStatus(state, newLoadingStatus) {
      state.oneBookLoadingStatus = newLoadingStatus;
    },
    resetPagination(state) {
      state.startIndex = 0;
      state.maxResults = 40;
    },
  },
  actions: {
    async fetchData({ commit, getters }) {
      const {getSearchQuery, getOrderBy, getSelectedCategory, getStartIndex, getMaxResults, getBaseUrl, getApiKey} = getters;
      if (!getSearchQuery) return
      try {
        commit('setAllBooksLoadingStatus', 'loading');
        const response = await axios.get(getBaseUrl, {
          params: {
            key: getApiKey,
            q: getSearchQuery,
            orderBy: getOrderBy,
            subject: getSelectedCategory !== 'all' ? getSelectedCategory : undefined,
            startIndex: getStartIndex,
            maxResults: getMaxResults
          },
        });
        if (getStartIndex === 0) {
          commit('setBooksList', response.data.items || []);
          commit('setBooksObject', response.data.items || []);
        } else {
          commit('appendBooks', response.data.items || []);
        }
        commit('setAllBooksLoadingStatus', 'done');
      } catch (error) {
        commit('setAllBooksLoadingStatus', 'error');
        console.error('Ошибка при запросе данных:', error);
      }
    },
    async getOneBook({ commit, getters }, bookId) {
      const { getBaseUrl, getApiKey } = getters;
      try {
        commit('setOneBookLoadingStatus', 'loading');
        const { data } = await axios.get(`${getBaseUrl}${bookId}`, {
          params: {
            key: getApiKey,
          },
        });
        if (data) {
          console.log(data);
          commit('setOpenedBook', data);
          commit('setOneBookLoadingStatus', 'done');
        } else {
          commit('setOneBookLoadingStatus', 'error');
        }
      } catch (error) {
        commit('setOneBookLoadingStatus', 'error');
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
