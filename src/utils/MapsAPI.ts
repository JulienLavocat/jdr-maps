import axios from "axios";
import { Universe } from "./state";

const API = import.meta.env.SNOWPACK_PUBLIC_API_URL;
const S3: string = import.meta.env.SNOWPACK_PUBLIC_S3_URL;

const http = axios.create({
	baseURL: API,
	headers: {
		"Content-type": "application/json",
	},
});

export interface MapData {
	id: string;
	width: number;
	height: number;
	name: string;
	universe: string;
}

export default class MapsAPI {
	static async getMaps(universeId: string): Promise<MapData[]> {
		return fetch(`${API}/maps/${universeId}`).then((r) => r.json());
	}

	static getMapUrl(map: string) {
		return `${S3}/${map}`;
	}

	static async uploadMap(
		file: File,
		name: string,
		universe: string,
		onUploadProgress: (progressEvent: any) => void,
	): Promise<{ success: boolean; message: string; universe: Universe }> {
		const formData = new FormData();
		formData.append("name", name);
		formData.append("universe", universe);
		formData.append("file", file); // File must be at the end of body

		const r = await http.post("/maps", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			onUploadProgress,
		});
		return r.data;
	}

	static async deleteMap(
		universeId: string,
		map: string,
	): Promise<MapData[]> {
		const r = await http.delete(`/maps/${universeId}/${map}`);
		return r.data;
	}

	static async listUniverses(token: string) {
		const r = await http.get("/universes", {
			headers: {
				Authorization: "Bearer " + token,
			},
		});
		return r.data;
	}
}
