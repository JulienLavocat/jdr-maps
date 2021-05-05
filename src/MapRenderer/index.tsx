import React, { useContext } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	ImageOverlay,
	useMapEvents,
	MarkerProps,
} from "react-leaflet";
import { CRS, Icon, LatLngBounds, LatLngExpression } from "leaflet";
import {
	atom,
	useRecoilState,
	useRecoilValue,
	useSetRecoilState,
} from "recoil";
import { MarkerColors, makeMarkerIcon, getRandomColor } from "./MarkerIcons";
import { nanoid } from "nanoid";
import { markersState, markerColors } from "./mapState";
import { useRoom } from "../hooks/useRoom";
import { CurrentRoomCtx } from "../App";

export default function MapRenderer() {
	const { markers, removeMarker } = useContext(CurrentRoomCtx);
	const color = useRecoilValue(markerColors);

	return (
		<MapContainer center={[500, 500]} zoom={0} crs={CRS.Simple}>
			<ImageOverlay
				bounds={new LatLngBounds([0, 0], [1000, 1000])}
				url="/map_collier.png"
			/>
			{markers.map((e) => (
				<ColoredMaker
					title="sqdq"
					position={e.pos}
					color={e.color}
					key={e.id}
					eventHandlers={{
						dblclick: () => removeMarker(e.id),
					}}
				>
					<Popup></Popup>
				</ColoredMaker>
			))}
			<MapEventsHandler />
		</MapContainer>
	);
}

function ColoredMaker(props: MarkerProps & { color: MarkerColors | string }) {
	return <Marker {...props} icon={makeMarkerIcon(props.color)}></Marker>;
}

function MapEventsHandler() {
	const { addMarker } = useContext(CurrentRoomCtx);

	const setMarkers = useSetRecoilState(markersState);
	const map = useMapEvents({
		click: (e) => {
			addMarker(e.latlng);
			//setMarkers((old) => [...old, { id: nanoid(), pos: e.latlng }]);
		},
	});

	return null;
}
