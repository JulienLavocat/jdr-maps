import { LatLngExpression } from "leaflet";
import React, { createContext, useState } from "react";
import "./Room.css";
import MapRenderer from "../../components/MapRenderer";
import { useRoom, UseRoom } from "../../hooks/useRoom";
import { useParams } from "react-router";

export const CurrentRoomCtx = createContext<UseRoom>({
	color: "black",
	markers: [],
	tokens: [],
	addMarker: () => {},
	removeMarker: () => {},
	addToken: () => {},
	updateTokenPos: () => {},
	removeToken: () => {},
	mapUrl: "",
	setMap: () => {},
});

function App() {
	const { roomId } = useParams<{ roomId: string }>();
	const room = useRoom(roomId);

	return (
		<div>
			<CurrentRoomCtx.Provider value={room}>
				<MapRenderer />
			</CurrentRoomCtx.Provider>
		</div>
	);
}

export default App;
