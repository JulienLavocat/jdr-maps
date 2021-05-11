import axios from "axios";

const API = import.meta.env.SNOWPACK_PUBLIC_API_URL;
const S3: string = import.meta.env.SNOWPACK_PUBLIC_S3_URL;

const http = axios.create({
	baseURL: API,
	headers: {
		"Content-type": "application/json",
	},
});

export interface MapData {
	name: string;
	date: string;
	url: string;
	id: string;
}

export default class MapsAPI {
	static async getMaps(): Promise<MapData[]> {
		return fetch(API + "/maps").then((r) => r.json());
	}

	static getMapUrl(map: string) {
		return `${S3}/${map}`;
	}

	static async uploadMap(
		file: File,
		name: string,
		universe: string,
		onUploadProgress: (progressEvent: any) => void,
	): Promise<{ success: boolean; message: string; maps: MapData[] }> {
		const formData = new FormData();
		formData.append("name", file.name);
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

	static async deleteMap(map: string): Promise<MapData[]> {
		const r = await http.delete("/maps/" + map);
		return r.data;
	}
}
