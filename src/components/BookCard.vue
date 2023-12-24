<template>
  <div class="book-list__item" @click="() => openBookPage(book.id)">
      <img
          class="book-list__item-image"
          :src="book.volumeInfo?.imageLinks?.smallThumbnail || book.volumeInfo?.imageLinks?.thumbnail || '#'"
          :alt="book.volumeInfo?.title || ''"
          @error="handleImageError"
      />
      <p  class="book-list__item-info-text book-list__item-info-text_type_categories">{{ book.volumeInfo?.categories?.[0] || '' }}</p>
      <h4 class="book-list__item-info-text book-list__item-info-text_type_title" >{{ book.volumeInfo?.title || '' }}</h4>
      <p  class="book-list__item-info-text book-list__item-info-text_type_authors" >{{ book.volumeInfo?.authors?.join(', ') || '' }}</p>
  </div>
</template>

<script>
import noImage from "@/assets/no-image.png";
export default {
  name: "BookCard",
  props: {
    book: Object,
  },
  methods: {
    handleImageError(event) {
      event.target.src = noImage;
    },
    openBookPage(id) {
      this.$router.push({ name: 'book', params: { id: id } });
    }
  },
}
</script>

<style scoped>
.book-list__item {
  background: #e8e8e8;
  height: 100%;
  display: grid;
  text-align: start;
  grid-template-rows: 60% 16px 46px 32px;
  grid-template-columns: 1fr;
  align-items: start;
  grid-template-areas: 'image'
  'category'
  'title'
  'authors';
  gap: 5px;
  padding: 10px;
  cursor: pointer;
  transition: box-shadow 0.5s ease;
  text-decoration: none;
  color: black;
}
.book-list__item:hover {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}
.book-list__item-image {
  width: 60%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  grid-area: image;
  justify-self: center;
}
.book-list__item-info-text {
  margin: 0;
}
.book-list__item-info-text_type_categories {
  grid-area: category;
}
.book-list__item-info-text_type_title {
  grid-area: title;
}
.book-list__item-info-text_type_authors {
  grid-area: authors;
}
</style>