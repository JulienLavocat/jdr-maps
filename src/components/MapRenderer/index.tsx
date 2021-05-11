import { CRS, LatLngBounds, LatLngExpression } from "leaflet";
import React, { useContext, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
	ImageOverlay,
	LayersControl,
	MapContainer,
	useMap,
	useMapEvents,
} from "react-leaflet";
import { CurrentRoomCtx } from "../../pages/Room/index";
import { MapPin } from "./MapPin";
import MapToken from "./MapToken";
import MapsAPI from "../../utils/MapsAPI";

export default function MapRenderer() {
	const { markers, tokens, maps, currentMap } = useContext(CurrentRoomCtx);
	//console.log("Current map", maps[currentMap].name);

	return (
		<div>
			<MapContainer
				center={[500, 500]}
				zoom={0}
				crs={CRS.Simple}
				doubleClickZoom={false}
				attributionControl={false}
			>
				<LayersControl position="bottomright">
					{maps.map((e, index) => {
						const isChecked = index === currentMap;
						console.log(e.name, isChecked);

						return e ? (
							<LayersControl.BaseLayer
								key={e.name}
								checked={isChecked}
								name={e.name}
							>
								<ImageOverlay
									bounds={
										new LatLngBounds([0, 0], [1000, 1000])
									}
									url={MapsAPI.getMapUrl(e.name)}
								/>
							</LayersControl.BaseLayer>
						) : null;
					})}
				</LayersControl>

				{markers.map((e) => (
					<MapPin color={e.color} id={e.id} pos={e.pos} key={e.id} />
				))}
				{tokens.map((e) => {
					console.log(e);

					return (
						<MapToken
							id={e.id}
							img={e.imgUrl}
							pos={e.pos}
							size={e.size}
							rotationAngle={e.rotation}
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
	const { addMarker, flyTo, on } = useContext(CurrentRoomCtx);
	const map = useMap();
	const mousePos = useRef(map.getCenter());

	const lastKeydown = useRef(Date.now());
	const lastFlyTo = useRef(Date.now());

	on("fly_to", (pos: LatLngExpression, zoom: number) => map.flyTo(pos, zoom));

	useMapEvents({
		dblclick: (e) => {
			addMarker(e.latlng);
		},
		keydown: (e) => {
			const { ctrlKey, code } = e.originalEvent;

			if (ctrlKey && code === "KeyB") {
				console.log(
					Date.now(),
					lastKeydown.current,
					Date.now() - lastKeydown.current,
				);

				if (Date.now() - lastKeydown.current < 1000) return;
				else lastKeydown.current = Date.now();

				if (Date.now() - lastFlyTo.current < 5000) return;

				flyTo(mousePos.current, map.getZoom());
				lastFlyTo.current = Date.now();
			}
		},
		mousemove: (e) => (mousePos.current = e.latlng),
	});

	return null;
}
