<template>
	<transition name="slide-fade">
		<div class="modal" v-if="show">
			<div class="modal__backdrop" @click="closeModal()" />

			<div class="modal__dialog">
				<div class="modal__body">
					<button
						type="button"
						class="modal__close"
						@click="closeModal()"
					>
						&#10006;
					</button>
					<slot name="body" />
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: "ModalCustom",
	data() {
		return {
			show: false
		};
	},
	methods: {
		closeModal() {
			this.show = false;
			document.querySelector("body").classList.remove("overflow-hidden");
		},
		openModal() {
			this.show = true;
			document.querySelector("body").classList.add("overflow-hidden");
		}
	}
};
</script>
