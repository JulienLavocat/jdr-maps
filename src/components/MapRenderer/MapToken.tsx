import React, { useCallback, useContext, useMemo, useState } from "react";
import {
	Icon,
	LeafletEventHandlerFnMap,
	Marker as LeafletMarker,
} from "leaflet";
import { MarkerData } from "../../hooks/useRoom";
import { Marker, Popup } from "react-leaflet";
import { useRef } from "react";
import { LatLngExpression } from "leaflet";
import { CurrentRoomCtx } from "../../pages/Room/index";

export default function MapToken({
	pos,
	id,
	img,
	size,
}: {
	img: string;
	pos: LatLngExpression;
	id: string;
	size: number;
}) {
	const { updateTokenPos, removeToken } = useContext(CurrentRoomCtx);
	const markerRef = useRef<LeafletMarker>(null);
	const eventHandlers = useMemo<LeafletEventHandlerFnMap>(
		() => ({
			keyup(e) {
				if (e.originalEvent.key !== "Backspace") return;
				console.log("Removing token " + id);

				removeToken(id);
			},
			dragend() {
				const marker = markerRef.current;
				if (marker != null) {
					const pos = marker.getLatLng();
					updateTokenPos(id, pos);
				}
			},
		}),
		[],
	);

	return (
		<Marker
			draggable={true}
			eventHandlers={eventHandlers}
			position={pos}
			key={id}
			ref={markerRef}
			icon={makeMarkerIcon("/tokens" + img, size)}
		>
			{/* <Popup>Character token</Popup> */}
		</Marker>
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
