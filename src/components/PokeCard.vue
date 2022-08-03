<template>
	<div class="event-card-bg">
		<div
			@click="openModal(pokemon.details)"
			:class="'event-card bg-' + pokemon.details.types[0].type.name"
		>
			<span class="status-icon-r"
				>#{{ ("0000" + pokemon.details.id).slice(-5) }}</span
			>

			<div class="avatar">
				<img
					v-bind:src="
						pokemon.details.sprites.front_default
							? pokemon.details.sprites.front_default
							: require(`@/assets/images/pokemon-icon.png`)
					"
				/>
			</div>
			<h4 class="title">{{ pokemon.name.replace(/-/gi, " ") }}</h4>
			<div class="types">
				<span
					v-for="(type, index) in pokemon.details.types"
					:key="index"
				>
					{{ index >= 1 ? " / " : "" }} {{ type.type.name }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		callback: {
			type: Function
		},
		pokemon: {
			type: Object,
			required: true
		}
	},
	components: {},
	methods: {
		openModal: function (pokemon) {
			this.callback(pokemon);
		}
	}
};
</script>

<style>
.bg-normal {
	background-color: rgb(168 167 122 / 45%);
}
.bg-fire {
	background-color: rgb(238 129 48 / 45%);
}
.bg-water {
	background-color: rgb(99 144 240 / 45%);
}
.bg-electric {
	background-color: rgb(247 208 44 / 45%);
}
.bg-grass {
	background-color: rgb(122 199 76 / 45%);
}
.bg-ice {
	background-color: rgb(150 217 214 / 45%);
}
.bg-fighting {
	background-color: rgb(194 46 40 / 45%);
}
.bg-poison {
	background-color: rgb(163 62 161 / 45%);
}
.bg-ground {
	background-color: rgb(226 191 101 / 45%);
}
.bg-flying {
	background-color: rgb(169 143 243 / 45%);
}
.bg-psychic {
	background-color: rgb(249 85 135 / 45%);
}
.bg-bug {
	background-color: rgb(166 185 26 / 45%);
}
.bg-rock {
	background-color: rgb(182 161 54 / 45%);
}
.bg-ghost {
	background-color: rgb(115 87 151 / 45%);
}
.bg-dragon {
	background-color: rgb(111 53 252 / 45%);
}
.bg-dark {
	background-color: rgb(112 87 70 / 45%);
}
.bg-steel {
	background-color: rgb(183 183 206 / 45%);
}
.bg-fairy {
	background-color: rgb(214 133 173 / 45%);
}
</style>
