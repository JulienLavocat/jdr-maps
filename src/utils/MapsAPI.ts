const API = import.meta.env.SNOWPACK_PUBLIC_API_URL;
const S3: string = import.meta.env.SNOWPACK_PUBLIC_S3_URL;

export default class MapsAPI {
	static async getMaps() {
		return fetch(API + "/maps").then((r) => r.json());
	}

	static async getMapUrl(map: string) {
		return `${S3}/${map}`;
	}
}
