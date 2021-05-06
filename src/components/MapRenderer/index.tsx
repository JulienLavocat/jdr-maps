import { CRS, LatLngBounds } from "leaflet";
import React, { useContext } from "react";
import { ImageOverlay, MapContainer, useMapEvents } from "react-leaflet";
import { CurrentRoomCtx } from "../../App";
import { MapPin } from "./MapPin";
import MapToken from "./MapToken";
import TokenSpawner from "./TokenSelector";

export default function MapRenderer() {
	const { markers, tokens } = useContext(CurrentRoomCtx);

	return (
		<div>
			<MapContainer center={[500, 500]} zoom={0} crs={CRS.Simple}>
				<ImageOverlay
					bounds={new LatLngBounds([0, 0], [1000, 1000])}
					url="/maps/Garde.jpg"
				/>
				{markers.map((e) => (
					<MapPin color={e.color} id={e.id} pos={e.pos} key={e.id} />
				))}
				{tokens.map((e) => {
					return (
						<MapToken
							id={e.id}
							img={e.imgUrl}
							pos={e.pos}
							size={e.size}
							key={e.id}
						/>
					);
				})}
				<MapEventsHandler />
			</MapContainer>
			<TokenSpawner />
		</div>
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
