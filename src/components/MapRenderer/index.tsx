import { CRS, LatLngBounds } from "leaflet";
import React, { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
	ImageOverlay,
	MapContainer,
	useMap,
	useMapEvents,
} from "react-leaflet";
import { CurrentRoomCtx } from "../../pages/Room/index";
import { MapPin } from "./MapPin";
import MapToken from "./MapToken";
import MapsAPI from "../../utils/MapsAPI";

export default function MapRenderer() {
	const { markers, tokens, mapUrl } = useContext(CurrentRoomCtx);
	const [showMapSelector, setShowMapSelector] = useState(false);
	return (
		<div>
			<MapContainer
				center={[500, 500]}
				zoom={0}
				crs={CRS.Simple}
				doubleClickZoom={false}
				attributionControl={false}
			>
				<ImageOverlay
					bounds={new LatLngBounds([0, 0], [1000, 1000])}
					url={MapsAPI.getMapUrl(mapUrl)}
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
		</div>
	);
}

function MapEventsHandler() {
	const { addMarker } = useContext(CurrentRoomCtx);
	const map = useMap();

	useMapEvents({
		dblclick: (e) => {
			addMarker(e.latlng);
		},
	});

	return null;
}
