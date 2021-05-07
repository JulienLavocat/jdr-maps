import { LatLngExpression } from "leaflet";
import React, { createContext, useState } from "react";
import "./Room.css";
import MapRenderer from "../../components/MapRenderer";
import { useRoom, UseRoom } from "../../hooks/useRoom";
import { useParams } from "react-router";
import { Tab, Tabs } from "react-bootstrap";
import TokenSpawner from "../../components/MapRenderer/AdminTools/TokenSpawner";
import MapSelector from "../../components/MapRenderer/AdminTools/MapSelector";

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
				<Tabs defaultActiveKey="map">
					<Tab eventKey="map" title="Map">
						<MapRenderer />
					</Tab>
					<Tab eventKey="tokens" title="Tokens">
						<TokenSpawner />
					</Tab>
					<Tab eventKey="changeMap" title="Changer de map">
						<MapSelector />
					</Tab>
				</Tabs>
			</CurrentRoomCtx.Provider>
		</div>
	);
}

export default App;
