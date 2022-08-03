<template>
	<nav class="nav-main">
		<router-link to="/github"
			><img
				class="img-logo-github"
				v-bind:src="require(`@/assets/images/github_logo.png`)"
		/></router-link>
	</nav>
	<router-view />
</template>

<style lang="scss">
@import "@/assets/styles.scss";
</style>
