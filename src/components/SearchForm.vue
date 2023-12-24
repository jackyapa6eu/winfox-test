<template>
  <form class="search-form" name="searchForm" @submit="fetchData">
    <div class="search-form__bg"/>
    <div class="search-form__content-container">
      <h1 class="search-form__title" @click="goHome">Search for books</h1>
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
</template>

<script>
export default {
  name: "SearchForm",
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
  methods: {
    async fetchData(event) {
      event.preventDefault();
      this.$router.push({ name: 'home'});
      this.$store.dispatch('resetPagination');
      await this.$store.dispatch('fetchData');
    },
    goHome() {
      this.$router.push({ name: 'home'});
    }
  },
  computed: {
    selectedCategory: {
      get() {
        return this.$store.getters.getSelectedCategory;
      },
      set(value) {
        this.$store.commit('setSelectedCategory', value);
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
    searchQuery: {
      get() {
        return this.$store.getters.getSearchQuery;
      },
      set(value) {
        this.$store.commit('setSearchQuery', value);
      },
    },
  }
}
</script>

<style scoped>
.search-form__sort-select select, .search-form__category-select select {
  border-radius: 0;
}
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
  cursor: pointer;
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

@media screen and (max-width: 400px){
  .search-form {
    padding: 5px;
  }
  .search-form__title {
    font-size: 32px;
  }
}
</style>