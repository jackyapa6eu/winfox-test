import { createRouter, createWebHistory } from 'vue-router';
import BooksList from "@/components/BooksList";
import BookPage from "@/components/BookPage";

const routes = [
	{ path: '/', name: 'home', component: BooksList },
	{ path: '/book/:id', name: 'book', component: BookPage },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
