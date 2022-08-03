import axios from "axios";

const apiClient = axios.create({
	baseURL: "https://pokeapi.co/api/v2/pokemon",
	withCredentials: false,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json"
	}
});

export default {
	getPokeList() {
		return apiClient.get("?limit=2000&offset=0");
	},
	getPokeListDetails(name) {
		return apiClient.get("/" + name);
	}
};
