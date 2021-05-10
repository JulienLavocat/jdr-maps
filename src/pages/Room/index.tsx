import React, { createContext } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router";
import ChatRoom from "../../components/ChatRoom";
import MapRenderer from "../../components/MapRenderer";
import MapSelector from "../../components/MapRenderer/AdminTools/MapSelector";
import TokenSpawner from "../../components/MapRenderer/AdminTools/TokenSpawner";
import { useRoom, UseRoom } from "../../hooks/useRoom";
import "./Room.css";
import { useRecoilValue } from "recoil";
import { characterName } from "../../utils/state";
import RoomUsers from "../../components/RoomUsers/index";

export const CurrentRoomCtx = createContext<UseRoom>({
	color: "black",
	markers: [],
	tokens: [],
	addMarker: () => {},
	removeMarker: () => {},
	addToken: () => {},
	updateToken: () => {},
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
		clearMessages: () => {},
	}),
	users: {},
	flyTo: () => {},
	on: () => {},
});

function App() {
	const { roomId } = useParams<{ roomId: string }>();
	const room = useRoom(roomId, useRecoilValue(characterName) || "");

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
					<Tab eventKey="users" title="Users">
						<RoomUsers />
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
