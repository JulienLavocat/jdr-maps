import React, { useContext } from "react";
import { Marker, MarkerProps, Popup } from "react-leaflet";
import {} from "./MarkerIcons";
import { MarkerColors, makeMarkerIcon } from "../MapRenderer/MarkerIcons";
import { MarkerData } from "../../hooks/useRoom";
import { CurrentRoomCtx } from "../../App";
import { LatLngExpression } from "leaflet";

export const MapPin = ({
	pos,
	id,
	color,
}: {
	pos: LatLngExpression;
	id: string;
	color: string;
}) => {
	const removeMarker = useContext(CurrentRoomCtx).removeMarker;

	return (
		<ColoredMaker
			position={pos}
			color={color}
			key={id}
			eventHandlers={{
				dblclick: () => removeMarker(id),
			}}
		>
			<Popup></Popup>
		</ColoredMaker>
	);
};

function ColoredMaker(props: MarkerProps & { color: MarkerColors | string }) {
	return <Marker {...props} icon={makeMarkerIcon(props.color)}></Marker>;
}
