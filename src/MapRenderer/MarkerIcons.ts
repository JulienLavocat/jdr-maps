import { Icon } from "leaflet";

export type MarkerColors =
	| "black"
	| "blue"
	| "gold"
	| "grey"
	| "orange"
	| "red"
	| "violet"
	| "yellow";

const COLORS = [
	"black",
	"blue",
	"gold",
	"grey",
	"orange",
	"red",
	"violet",
	"yellow",
];

export const makeMarkerIcon = (color: MarkerColors | string) =>
	new Icon({
		iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
		shadowUrl:
			"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});

const BlackMarker = makeMarkerIcon("black");
const BlueMarker = makeMarkerIcon("blue");
const GoldMarker = makeMarkerIcon("gold");
const GrayMarker = makeMarkerIcon("grey");
const OrangeMarker = makeMarkerIcon("orange");
const RedMarker = makeMarkerIcon("red");
const VioletMarker = makeMarkerIcon("violet");
const YellowMarker = makeMarkerIcon("yellow");

export const getRandomColor = () => {
	return COLORS[Math.floor(Math.random() * COLORS.length)] as MarkerColors;
};

export {
	BlackMarker,
	BlueMarker,
	GoldMarker,
	GrayMarker,
	OrangeMarker,
	RedMarker,
	VioletMarker,
	YellowMarker,
};
