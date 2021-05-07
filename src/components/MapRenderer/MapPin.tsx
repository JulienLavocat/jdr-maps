import React, { useContext } from "react";
import { Marker, MarkerProps, Popup } from "react-leaflet";
import {} from "./MarkerIcons";
import { MarkerColors, makeMarkerIcon } from "../MapRenderer/MarkerIcons";
import { MarkerData } from "../../hooks/useRoom";
import { LatLngExpression } from "leaflet";
import { CurrentRoomCtx } from "../../pages/Room/index";

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
			eventHandlers={{
				dblclick: () => removeMarker(id),
			}}
		>
			<Popup key={"popup" + id}></Popup>
		</ColoredMaker>
	);
};

function ColoredMaker(props: MarkerProps & { color: MarkerColors | string }) {
	return <Marker {...props} icon={makeMarkerIcon(props.color)}></Marker>;
}
