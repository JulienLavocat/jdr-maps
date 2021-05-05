import { atom } from "recoil";
import { LatLngExpression } from "leaflet";

export const markersState = atom<{ id: string; pos: LatLngExpression }[]>({
	key: "maps-markers",
	default: [],
});

export const markerColors = atom<string>({
	key: "map-marker-color",
	default: "black",
});
