import { LatLngExpression } from "leaflet";
import React, { createContext, useState } from "react";
import "./Room.css";
import MapRenderer from "../../components/MapRenderer";
import { useRoom, UseRoom } from "../../hooks/useRoom";
import { useParams } from "react-router";
import { Tab, Tabs } from "react-bootstrap";
import TokenSpawner from "../../components/MapRenderer/AdminTools/TokenSpawner";
import MapSelector from "../../components/MapRenderer/AdminTools/MapSelector";
import ChatRoom from "../../components/ChatRoom";
import { useRecoilValue } from "recoil";
import { characterName } from "../../utils/state";

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
	chats: [],
	useChat: () => ({
		initialize: () => {},
		messages: [],
		isReady: false,
		sendMessage: () => {},
		users: {},
	}),
});

function App() {
	const { roomId } = useParams<{ roomId: string }>();
	const room = useRoom(roomId);

	return (
		<div>
			<CurrentRoomCtx.Provider value={room}>
				<Tabs defaultActiveKey="map">
					<Tab eventKey="map" title="Map" style={{}}>
						<MapRenderer />
					</Tab>
					<Tab eventKey="tokens" title="Tokens">
						<TokenSpawner />
					</Tab>
					<Tab eventKey="changeMap" title="Changer de map">
						<MapSelector />
					</Tab>
					{room.chats.map((e) => (
						<Tab
							eventKey={"chat_" + e.id}
							title={"#" + e.name}
							key={"chat_" + e.id}
						>
							<ChatRoom channel={e} />
						</Tab>
					))}
				</Tabs>
			</CurrentRoomCtx.Provider>
		</div>
	);
}

export default App;
