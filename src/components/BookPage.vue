<template>
  <LoadingIcon v-if="oneBookLoadingStatus === 'loading'" color="rgb(41, 11, 84)" :size="80" />
  <div v-if="oneBookLoadingStatus === 'error'">
    Произошла ошибка при загрузке данных. Пожалуйста, повторите попытку.
  </div>
  <div v-if="openedBook" class="book-container">
    <div class="book-container__image-container">
      <img
          class="book-container__image"
          :src="openedBook.volumeInfo?.imageLinks?.smallThumbnail || openedBook.volumeInfo?.imageLinks?.thumbnail || '#'"
          :alt="openedBook.volumeInfo?.title || ''"
          @error="handleImageError"
      />
    </div>
    <div class="book-container__info">
      <p  class="book-container__info-item book-container__info-item_type_categories">{{ openedBook.volumeInfo?.categories?.join(', ') || ''}}</p>
      <h4 class="book-container__info-item book-container__info-item_type_title">{{ openedBook.volumeInfo?.title || '' }}</h4>
      <p  class="book-container__info-item book-container__info-item_type_authors">{{ openedBook.volumeInfo?.authors?.join(', ') || '' }}</p>
      <p  class="book-container__info-item">{{ openedBook.volumeInfo?.description || '' }}</p>
    </div>
  </div>
</template>

<script>
import noImage from "@/assets/no-image.png";
import LoadingIcon from "@/ui/LoadingIcon";

export default {
  name: "BookPage",
  components: { LoadingIcon },
  data() {
    return {
      bookId: null,
    };
  },
  computed: {
    openedBook() {
      return this.$store.getters.getOpenedBook;
    },
    oneBookLoadingStatus() {
      return this.$store.getters.getOneBookLoadingStatus;
    },
  },
  methods: {
    handleComponentMount() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      this.bookId = this.$route.params.id;
      if (this.bookId in this.$store.getters.getBooksObject) {
        this.$store.commit('setOpenedBook', this.$store.getters.getBooksObject[this.bookId]);
      } else {
        this.$store.dispatch('getOneBook', this.bookId);
      }
    },
    handleImageError(event) {
      event.target.src = noImage;
    },
  },
  mounted() {
    this.handleComponentMount();
  },
}
</script>

<style scoped>
.book-container {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(300px, 0.5fr) 1fr;
  min-height: calc(100vh - 144px);
  gap: 20px;
}
.book-container__image-container {
  width: 100%;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.book-container__image {
  height: 75%;
}
.book-container__info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.book-container__info-item {
  margin: 0;
}
.book-container__info-item_type_categories {
  color: gray;
}
.book-container__info-item_type_title {
  font-size: 24px;
}
.book-container__info-item_type_authors {
  color: gray;
  text-decoration: underline;
}

@media screen and (max-width: 600px) {
  .book-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .book-container__image {
    height: auto;
    width: 60%;
  }
}
</style>