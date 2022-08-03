<template>
	<div class="btn-container">
		<input
			ref="checkboxSearcher"
			class="c-checkbox"
			type="checkbox"
			id="checkbox"
		/>
		<div class="c-formContainer">
			<div class="c-form">
				<input
					class="c-form__input"
					placeholder="ID or Name"
					type="text"
					@keyup.enter="getPokemon"
					v-model="searchPoke"
				/>
				<label class="c-form__buttonLabel" for="checkbox">
					<button
						@click="getPokemon"
						class="c-form__button"
						type="button"
					>
						Search
					</button>
				</label>
				<label
					class="c-form__toggle"
					for="checkbox"
					data-title="Click to Choose your Starter"
				></label>
			</div>
		</div>
	</div>
	<div class="filter-container">
		<select
			class="minimal"
			name="LeaveType"
			@change="setListFilter($event)"
		>
			<option selected value="num_asc">Lowest Number</option>
			<option value="num_desc">Highest Number</option>
			<option value="abc_desc">A - Z</option>
			<option value="abc_asc">Z - A</option>
		</select>
	</div>
	<div class="pagination-container">
		<span>Full List</span>
		<label class="switch">
			<input type="checkbox" @click="toggleCheckbox" />
			<div class="slider round"></div>
		</label>
	</div>

	<div class="container">
		<PokeCard
			:callback="openDetails"
			v-for="(pokemon, index) in pokeList"
			:key="index"
			:pokemon="pokemon"
		/>
	</div>

	<div class="pagination-container bottom">
		<button v-if="Prev_btn" v-show="PaginationBtn" v-on:click="prevPage">
			Prev
		</button>
		<button v-if="Next_btn" v-show="PaginationBtn" v-on:click="nextPage">
			Next
		</button>
		<button v-if="Next_btn" v-show="!PaginationBtn" v-on:click="nextPage">
			Load More
		</button>
	</div>

	<modal ref="modalPokemonDetails">
		<template v-slot:body>
			<div
				:class="
					'avatar-details bg-' + pokemonDetails.types[0].type.name
				"
			>
				<span class="code-modal"
					>#{{ ("0000" + pokemonDetails.id).slice(-5) }}</span
				>
				<img
					v-bind:src="
						pokemonDetails.sprites.other['official-artwork']
							.front_default
							? pokemonDetails.sprites.other['official-artwork']
									.front_default
							: require(`@/assets/images/pokemon-icon.png`)
					"
				/>
			</div>
			<h4
				:class="
					'title-details str-' + pokemonDetails.types[0].type.name
				"
			>
				{{ pokemonDetails.name.replace(/-/gi, " ") }}
			</h4>
			<div class="about-details-main">
				<label>About:</label>
				<div class="about-details">
					<div class="about-details-weight">
						<label
							:class="'str-' + pokemonDetails.types[0].type.name"
							>{{
								pokemonDetails.weight
									? (pokemonDetails.weight / 10).toFixed(1) +
									  "kg"
									: "-none-"
							}}</label
						>
						<p>Weight</p>
					</div>
					<div class="about-details-weight">
						<label
							:class="'str-' + pokemonDetails.types[0].type.name"
							>{{
								pokemonDetails.height
									? (pokemonDetails.height / 10).toFixed(1) +
									  "m"
									: "-none-"
							}}</label
						>
						<p>Height</p>
					</div>
					<div class="about-details-weight">
						<label
							:class="'str-' + pokemonDetails.types[0].type.name"
							>{{
								pokemonDetails.base_experience
									? pokemonDetails.base_experience
									: "-none-"
							}}</label
						>
						<p>Base Exp</p>
					</div>
				</div>
			</div>
			<div class="status-details-main">
				<label>Base Stats:</label>
				<div class="status-details">
					<span
						v-for="(stats, index) in pokemonDetails.stats"
						:key="index"
					>
						<b
							>{{
								stats.stat.name == "attack"
									? "Atk"
									: stats.stat.name == "hp"
									? "HP"
									: stats.stat.name == "defense"
									? "Def"
									: stats.stat.name == "special-attack"
									? "Sp. Atk"
									: stats.stat.name == "special-defense"
									? "Sp. Def"
									: stats.stat.name == "speed"
									? "Speed"
									: ""
							}}:
						</b>
						<span
							:class="
								'status-data str-' +
								pokemonDetails.types[0].type.name
							"
							>{{ stats.base_stat }}</span
						>
					</span>
				</div>
			</div>
			<div class="trainers-details-main">
				<label>Trainers:</label>
				<div class="trainers-details">
					<span
						v-for="(trainer, index) in pokemonTrainers"
						:key="index"
					>
						<b>{{ (index > 0 ? " - " : "") + trainer }} </b>
					</span>
					<span v-if="pokemonTrainers.length === 0">
						<b>-none-</b>
					</span>
				</div>
			</div>
			<div class="type-details-main">
				<label>Type:</label>
				<div class="type-details">
					<span
						v-for="(type, index) in pokemonDetails.types"
						:key="index"
						:class="'bg-' + type.type.name"
					>
						{{ type.type.name }}
					</span>
				</div>
			</div>
		</template>
	</modal>

	<loading
		color="#d23f3f"
		v-model:active="isLoading"
		:can-cancel="true"
		:is-full-page="fullPage"
	/>
	<vue-basic-alert :duration="500" :closeIn="3000" ref="alert" />
</template>

<script>
import PokeCard from "@/components/PokeCard.vue";
import PokeService from "@/services/PokeService.js";
import Modal from "@/components/Modal";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Trainers from "@/assets/trainers.json";

export default {
	//props: ["page"],
	name: "CardList",
	components: {
		PokeCard,
		Modal,
		Loading
	},
	data() {
		return {
			Prev_btn: false,
			Next_btn: true,
			Trainers,
			pokemonTrainers: [],
			isLoading: false,
			fullPage: true,
			pokeList: [],
			pokeListAll: null,
			maxPokeList: null,
			temporalList: [],
			page: 0,
			pokeListLimits: 8,
			pokemonDetails: null,
			PaginationBtn: true,
			checkbox: false,
			searchPoke: "",
			listfilter: "num_asc"
		};
	},
	created() {
		var pokeListTemp = JSON.parse(localStorage.getItem("pokeListTemp"));
		if (!pokeListTemp) {
			PokeService.getPokeList()
				.then((response) => {
					let resonseTemp = response.data.results;
					resonseTemp.map((item, index) => {
						resonseTemp[index].id = index;
					});
					localStorage.setItem(
						"pokeListTemp",
						JSON.stringify(response.data.results)
					);
					this.pokeListAll = response.data.results;
					this.maxPokeList = response.data.results.length;
					this.getFilteredList();
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			this.pokeListAll = pokeListTemp;
			this.maxPokeList = pokeListTemp.length;
			this.getFilteredList();
		}
	},
	methods: {
		getTrainers: function (id) {
			this.pokemonTrainers = [];
			this.Trainers.map((item) => {
				if (item.team.indexOf(id) !== -1) {
					this.pokemonTrainers.push(item.name);
				} else {
					if (item.box.indexOf(id) !== -1) {
						this.pokemonTrainers.push(item.name);
					}
				}
			});
		},
		getPokemon: function () {
			if (this.searchPoke === "") {
				this.$refs.alert.showAlert(
					"error",
					"Search field is required.",
					"Required",
					{
						iconSize: 35,
						iconType: "solid",
						position: "top right"
					}
				);
				return false;
			}
			this.isLoading = true;
			return PokeService.getPokeListDetails(
				this.searchPoke.toLowerCase().replace(/ /gi, "-")
			)
				.then((response) => {
					setTimeout(() => {
						this.$refs.checkboxSearcher.checked = false;
						this.searchPoke = "";
						this.openDetails(response.data);
					}, 1500);
				})
				.catch((error) => {
					if (error) {
						this.$refs.alert.showAlert(
							"error",
							"Code or Name not found, please try again.",
							"404",
							{
								iconSize: 35,
								iconType: "solid",
								position: "top right"
							}
						);
						this.isLoading = false;
					}
				});
		},
		toggleCheckbox: function () {
			this.PaginationBtn = this.checkbox;
			this.checkbox = !this.checkbox;
			this.$emit("setCheckboxVal", this.checkbox);
			this.getFilteredList();
		},
		openDetails: function (pokemon) {
			this.getTrainers(pokemon.id);
			this.pokemonDetails = pokemon;
			this.$refs.modalPokemonDetails.openModal();
			this.isLoading = false;
		},
		nextPage: function () {
			if (
				this.pokeListLimits * this.page + this.pokeListLimits >=
				this.maxPokeList
			) {
				this.page;
				this.Next_btn = false;
			} else {
				this.page++;
				if (
					this.pokeListLimits * this.page + this.pokeListLimits >=
					this.maxPokeList
				) {
					this.Next_btn = false;
				}
				this.Prev_btn = true;
			}
			this.getPage();
		},
		prevPage: function () {
			if (this.page < 1) {
				this.page;
				this.Prev_btn = false;
			} else {
				this.page--;
				if (this.page == 0) {
					this.Prev_btn = false;
				}
				this.Next_btn = true;
			}
			this.getPage();
		},
		setListFilter: function (event) {
			this.listfilter = event.target.value;
			this.getFilteredList();
		},
		getFilteredList: function () {
			this.Prev_btn = false;
			this.Next_btn = true;
			this.page = 0;
			this.temporalList = [];
			this.pokeList = [];
			this.temporalList = this.pokeListAll;

			switch (this.listfilter) {
				case "num_asc":
					this.temporalList.sort(function (a, b) {
						return a.id - b.id;
					});
					break;
				case "num_desc":
					this.temporalList.sort(function (a, b) {
						return b.id - a.id;
					});
					break;
				case "abc_desc":
					this.temporalList.sort(function (a, b) {
						return a.name.localeCompare(b.name);
					});
					break;
				case "abc_asc":
					this.temporalList.sort(function (a, b) {
						return b.name.localeCompare(a.name);
					});
					break;
			}

			this.getPage();
		},
		getPage: function () {
			this.isLoading = true;
			var rangeMin = this.pokeListLimits * this.page;
			var rangeMax = rangeMin + this.pokeListLimits;

			let pokeListTemporal = this.temporalList.slice(rangeMin, rangeMax);

			var promises = pokeListTemporal.map((item, index) => {
				if (!item.details) {
					return PokeService.getPokeListDetails(item.name)
						.then((response) => {
							pokeListTemporal[index].details = response.data;
							let indexAll = this.pokeListAll.findIndex(
								(e) => e.name === item.name
							);
							if (indexAll !== -1) {
								this.pokeListAll[indexAll].details =
									response.data;
							}
						})
						.catch((error) => {
							console.log("Error:", error);
						});
				}
			});

			Promise.all(promises).then(() => {
				if (this.PaginationBtn) {
					this.pokeList = pokeListTemporal;
				} else {
					this.pokeList.push(...pokeListTemporal);
				}
				setTimeout(() => {
					this.isLoading = false;
				}, 1000);
			});
		}
	}
};
</script>
