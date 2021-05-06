import { CRS, LatLngBounds } from "leaflet";
import React, { useContext } from "react";
import {
	ImageOverlay,
	MapContainer,
	Marker,
	MarkerProps,
	Popup,
	useMapEvents,
} from "react-leaflet";
import { CurrentRoomCtx } from "../../App";
import { makeMarkerIcon, MarkerColors } from "./MarkerIcons";

export default function MapRenderer() {
	const { markers, removeMarker } = useContext(CurrentRoomCtx);

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

	const map = useMapEvents({
		click: (e) => {
			addMarker(e.latlng);
		},
	});

	return null;
}
