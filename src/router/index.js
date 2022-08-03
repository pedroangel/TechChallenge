import { createRouter, createWebHistory } from "vue-router";
import CardList from "../views/CardList.vue";

const routes = [
	{
		path: "/",
		name: "CardList",
		component: CardList
	},
	{
		path: "/github",
		beforeEnter() {
			window.open(
				"https://github.com/pedroangel/TechChallenge",
				"_blank"
			);
		}
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

router.beforeEach((to, from, next) => {
	next();
});

export default router;
