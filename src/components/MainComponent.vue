<template>
  <form class="search-form" @submit="fetchData">
    <div class="search-form__bg"/>
    <div class="search-form__content-container">
      <h1 class="search-form__title">Search for books</h1>
      <div class="search-form__input-container">
        <input class="search-form__search-input" v-model="searchQuery" >
        <button class="search-form__submit-button" type="submit"/>
      </div>
      <div class="search-form__filters-container">
        <label for="category" class="search-form__category-select">
          Categories
          <select id="category" v-model="selectedCategory" @change="updateFilters">
            <option v-for="option in categoryOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
          </select>
        </label>
        <label for="orderBy" class="search-form__sort-select">
          sorting by
          <select id="orderBy" v-model="orderBy" @change="updateOrderBy">
            <option v-for="option in orderByOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
          </select>
        </label>
      </div>

    </div>

  </form>
  <main class="main-content">
    <LoadingIcon v-if="loadingStatus === 'loading'" color="rgb(41, 11, 84)" :size="80" />
    <div v-if="loadingStatus === 'error'">
      Произошла ошибка при загрузке данных. Пожалуйста, повторите попытку.
    </div>

    <ul class="books-list">
      <li class="book-list__item" v-for="item in booksList" :key="item.id">
        <img
            class="book-list__item-image"
            :src="item.volumeInfo?.imageLinks?.smallThumbnail || item.volumeInfo?.imageLinks?.thumbnail || '#'"
            :alt="item.volumeInfo?.title || ''"
            @error="handleImageError"
        />
        <div class="book-list__item-info-container">
          <h4 class="book-list__item-info-text book-list__item-info-title" >{{ item.volumeInfo?.title || '' }}</h4>
          <p  class="book-list__item-info-text">{{ item.volumeInfo?.categories?.[0] || '' }}</p>
          <p  class="book-list__item-info-text book-list__item-info-authors" >{{ item.volumeInfo?.authors?.join(', ') || '' }}</p>
        </div>

      </li>
    </ul>
    <button v-if="booksList.length > 0" @click="loadMore">Загрузить еще</button>
  </main>
</template>

<script>
import noImage from '@/assets/no-image.png';
import LoadingIcon from "@/ui/LoadingIcon";
export default {
  data() {
    return {
      orderByOptions: [
        { value: 'relevance', label: 'Relevance' },
        { value: 'newest', label: 'Newest' }
      ],
      categoryOptions: [
        { value: 'all', label: 'All' },
        { value: 'art', label: 'Art' },
        { value: 'biography', label: 'Biography' },
        { value: 'computers', label: 'Computers' },
        { value: 'history', label: 'History' },
        { value: 'medical', label: 'Medical' },
        { value: 'poetry', label: 'Poetry' }
      ]
    }
  },
  components: {LoadingIcon},
  computed: {
    searchQuery: {
      get() {
        return this.$store.getters.getSearchQuery;
      },
      set(value) {
        this.$store.commit('setSearchQuery', value);
      },
    },
    orderBy: {
      get() {
        return this.$store.getters.getOrderBy;
      },
      set(value) {
        this.$store.commit('setOrderBy', value);
      },
    },
    selectedCategory: {
      get() {
        return this.$store.getters.getSelectedCategory;
      },
      set(value) {
        this.$store.commit('setSelectedCategory', value);
      },
    },
    loadingStatus() {
      return this.$store.getters.getLoadingStatus;
    },
    booksList() {
      return this.$store.getters.getBooksList;
    },
  },
  methods: {
    async fetchData(event) {
      event.preventDefault();
      this.$store.dispatch('resetPagination');
      await this.$store.dispatch('fetchData');
    },
    loadMore() {
      this.$store.dispatch('loadMore');
    },
    handleImageError(event) {
      console.log('NO IMAGE')
      event.target.src = noImage;
    },
  },
};
</script>

<style>
.search-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 12px;
}

.search-form__bg {
  position: absolute;
  background-image: url('../assets/books-bg.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  filter: blur(1px);
  z-index: -1;
}
.search-form__content-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.search-form__bg::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(41, 11, 84, 0.3);
}

.search-form__title {
  margin: 0;
  font-size: 40px;
  color: white;
}
.search-form__input-container {
  display: flex;
  align-items: end;
  width: 100%;
}
.search-form__filters-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search-form__search-input {
  height: 20px;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 0;
}
.search-form__sort-select, .search-form__category-select {
  color: white;
  text-shadow: 0 0 3px black;
}
.search-form__sort-select select, .search-form__category-select select {
  border-radius: 0;
}

.search-form__submit-button {
  width: 20px;
  height: 20px;
  background-image: url("../assets/searchIcon.svg");
  background-size: 20px;
  grid-area: submitButton;
  background-color: white;
  border: none;
  outline: none;
  cursor: pointer;
}

.books-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
  list-style: none;
}

.book-list__item {
  box-shadow: 0 0 2px #969696;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
  text-align: start;
}
.book-list__item-image {
  width: 60%;
}
.book-list__item-info-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;
}
.book-list__item-info-text {
  margin: 0;
}
.main-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media screen and (max-width: 400px){
  .search-form {
    padding: 5px;
  }
  .search-form__title {
    font-size: 32px;
  }
}
</style>