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
	"green",
];

export const COLORS_DETAILS: Record<
	string,
	{ outside: string; inside: string }
> = {
	black: { outside: "#313131", inside: "#3D3D3D" },
	blue: { outside: "#3274A3", inside: "#2A81CB" },
	gold: { outside: "#C1A32D", inside: "#FFD326" },
	grey: { outside: "#6B6B6B", inside: "#7B7B7B" },
	orange: { outside: "#98652E", inside: "#CB8427" },
	red: { outside: "#982E40", inside: "#CB2B3E" },
	green: { outside: "#31882A", inside: "#2AAD27" },
	violet: { outside: "#742E98", inside: "#9C2BCB" },
	yellow: { outside: "#988F2E", inside: "#CAC428" },
};

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
