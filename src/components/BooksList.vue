<template>
  <ul class="books-list">
    <li v-for="item in booksList" :key="item.id">
      <BookCard :book="item"/>
    </li>
  </ul>
  <button v-if="booksList.length > 0" @click="loadMore">Загрузить еще</button>
</template>

<script>
import BookCard from "@/components/BookCard";

export default {
  name: "BooksList",
  components: {BookCard},
  methods: {
    loadMore() {
      this.$store.dispatch('loadMore');
    },
  },
  computed: {
    booksList() {
      return this.$store.getters.getBooksList;
    },
  }
}
</script>

<style scoped>
.books-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(auto-fill, 400px);
  gap: 20px;
  list-style: none;
  padding: 0;
}

@media screen and (max-width: 1000px){
  .books-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 830px){
  .books-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 510px){
  .books-list {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>