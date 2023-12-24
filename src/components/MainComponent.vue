<template>
  <SearchForm />
  <main class="main-content">
    <LoadingIcon v-if="allBooksLoadingStatus === 'loading'" color="rgb(41, 11, 84)" :size="80" />
    <div v-if="allBooksLoadingStatus === 'error'">
      Произошла ошибка при загрузке данных. Пожалуйста, повторите попытку.
    </div>
    <router-view></router-view>
  </main>
</template>

<script>
import LoadingIcon from "@/ui/LoadingIcon";
import SearchForm from "@/components/SearchForm";
export default {
  components: { LoadingIcon, SearchForm},
  computed: {
    allBooksLoadingStatus() {
      return this.$store.getters.getAllBooksLoadingStatus;
    },
  },
  methods: {
    async fetchData(event) {
      event.preventDefault();
      this.$store.dispatch('resetPagination');
      await this.$store.dispatch('fetchData');
    },
  },
};
</script>

<style>
.main-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>