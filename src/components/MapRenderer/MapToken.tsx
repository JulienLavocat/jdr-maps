import React, { useCallback, useContext, useMemo, useState } from "react";
import {
	Icon,
	LeafletEventHandlerFnMap,
	Marker as LeafletMarker,
} from "leaflet";
import { MarkerData, TokenData } from "../../hooks/useRoom";
import { Marker, Popup } from "react-leaflet";
import { useRef } from "react";
import L, { LatLngExpression } from "leaflet";
import { CurrentRoomCtx } from "../../pages/Room/index";
import "./rotation.css";
import { RotatedMarker } from "./RotatedMarker";
import { RotatedMarker as LeafletRotatedMaker } from "leaflet-marker-rotation";

export default function MapToken({
	pos,
	id,
	img,
	size,
	rotationAngle,
}: {
	pos: LatLngExpression;
	id: string;
	img: string;
	size: number;
	rotationAngle: number;
}) {
	const { updateToken, removeToken } = useContext(CurrentRoomCtx);
	const markerRef = useRef<LeafletRotatedMaker>(null);
	const eventHandlers = useMemo<LeafletEventHandlerFnMap>(
		() => ({
			keyup(e) {
				switch (e.originalEvent.key) {
					case "Backspace":
						removeToken(id);
						break;

					case "r":
						const newRotation = rotationAngle + 45;
						//setRotation(newRotation);
						console.log(id, pos, newRotation);

						updateToken(id, pos, newRotation);
						break;

					default:
						break;
				}
			},
			dragend() {
				const marker = markerRef.current;
				if (marker != null) {
					const pos = marker.getLatLng();

					console.log(id, pos, rotationAngle);
					updateToken(id, pos, rotationAngle);
				}
			},
		}),
		[rotationAngle, pos],
	);

	return (
		<RotatedMarker
			draggable={true}
			eventHandlers={eventHandlers}
			position={pos}
			ref={markerRef}
			icon={makeMarkerIcon("/tokens" + img, size)}
			rotationAngle={rotationAngle}
			rotationOrigin="center"
		>
			{/* <Popup>Character token</Popup> */}
		</RotatedMarker>
	);
}

const makeMarkerIcon = (iconUrl: string, size: number) =>
	new Icon({
		iconUrl,
		shadowUrl:
			"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
		iconSize: [size, size],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [size, size],
		pane: "",
	});
