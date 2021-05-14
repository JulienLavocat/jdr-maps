import { CRS, LatLngBounds, LatLngExpression } from "leaflet";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
	ImageOverlay,
	LayersControl,
	MapContainer,
	useMap,
	useMapEvents,
	FeatureGroup,
} from "react-leaflet";
import { CurrentRoomCtx } from "../../pages/Room/index";
import { MapPin } from "./MapPin";
import MapToken from "./MapToken";
import MapsAPI from "../../utils/MapsAPI";
import { useLeafletContext } from "@react-leaflet/core";
import EditControl from "../EditControl/EditControl.jsx";

import "leaflet-draw/dist/leaflet.draw.css";
import { nanoid } from "nanoid";
import ShapesRenderer from "./ShapesRenderer";

export default function MapRenderer() {
	const { markers, tokens, maps, currentMap, addShape, shapes } = useContext(
		CurrentRoomCtx,
	);

	return (
		<div>
			<MapContainer
				center={[500, 500]}
				zoom={0}
				crs={CRS.Simple}
				doubleClickZoom={false}
				attributionControl={false}
			>
				<FeatureGroup>
					<EditControl
						position="topleft"
						onCreated={(e: any) => {
							e.target.removeLayer(e.layer);
							addShape({
								id: nanoid(),
								color: "#66ff66",
								ownerId: "",
								pos: e.layer._latlng,
								shape: {
									radius: e.layer.options.radius,
								},
								type: e.layerType,
							});
						}}
						// onDrawStop={(e: any) => console.log(e)}
						draw={{
							circle: {
								showRadius: false,
								shapeOptions: {
									color: "#66ff66",
								},
							},
							polyline: false,
							polygon: false,
							rectangle: false,
							marker: false,
							circlemarker: false,
						}}
					/>
					{/* <Circle center={[51.51, -0.06]} radius={200} /> */}
					<ShapesRenderer shapes={Object.values(shapes)} />
				</FeatureGroup>
				<LayersControl position="bottomright">
					{maps.map((e, index) => {
						const isChecked = index === currentMap;

						return e ? (
							<LayersControl.BaseLayer
								key={e.key}
								checked={isChecked}
								name={e.metadata.name}
							>
								<ImageOverlay
									bounds={
										new LatLngBounds(
											[0, 0],
											[
												e.metadata.height / 10,
												e.metadata.width / 10,
											],
										)
									}
									url={MapsAPI.getMapUrl(e.key)}
								/>
							</LayersControl.BaseLayer>
						) : null;
					})}
				</LayersControl>

				{Object.values(markers).map((e) => (
					<MapPin color={e.color} id={e.id} pos={e.pos} key={e.id} />
				))}
				{Object.values(tokens).map((e) => {
					return <MapToken {...e} key={e.id} />;
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

	useEffect(() => {
		map.fitWorld();

		return () => {};
	}, [map]);

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
