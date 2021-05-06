import { CRS, LatLngBounds } from "leaflet";
import React, { useContext } from "react";
import { ImageOverlay, MapContainer, useMapEvents } from "react-leaflet";
import { CurrentRoomCtx } from "../../App";
import { MapPin } from "./MapPin";
import MapToken from "./MapToken";

export default function MapRenderer() {
	const { markers, tokens } = useContext(CurrentRoomCtx);
	console.log("----------------");

	return (
		<MapContainer center={[500, 500]} zoom={0} crs={CRS.Simple}>
			<ImageOverlay
				bounds={new LatLngBounds([0, 0], [1000, 1000])}
				url="/map_collier.png"
			/>
			{markers.map((e) => (
				<MapPin color={e.color} id={e.id} pos={e.pos} />
			))}
			{tokens.map((e) => {
				return (
					<MapToken
						id={e.id}
						img={e.imgUrl}
						pos={e.pos}
						size={e.size}
					/>
				);
			})}
			<MapEventsHandler />
		</MapContainer>
	);
}

function MapEventsHandler() {
	const { addMarker } = useContext(CurrentRoomCtx);

	useMapEvents({
		click: (e) => {
			addMarker(e.latlng);
		},
	});

	return null;
}
