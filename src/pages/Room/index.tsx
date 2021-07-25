import React, { createContext } from "react";
import { Badge, Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router";
import ChatRoom from "../../components/ChatRoom";
import MapRenderer from "../../components/MapRenderer";
import MapSelector from "../../components/MapRenderer/AdminTools/MapSelector";
import TokenSpawner from "../../components/MapRenderer/AdminTools/TokenSpawner";
import { useRoom, UseRoom } from "../../hooks/useRoom";
import "./Room.css";
import { useRecoilValue, useRecoilState } from "recoil";
import {
	characterName,
	chatUnreadsState,
	currentUniverseState,
} from "../../utils/state";
import RoomUsers from "../../components/RoomUsers/index";
import Notifications from "../../components/Notifications/index";

export const CurrentRoomCtx = createContext<UseRoom>({
	color: "black",
	markers: {},
	tokens: {},
	addMarker: () => {},
	removeMarker: () => {},
	addToken: () => {},
	updateToken: () => {},
	removeToken: () => {},
	maps: [],
	currentMap: 0,
	setCurrentMap: () => {},
	setMaps: () => {},
	chats: [],
	useChat: () => ({
		initialize: () => {},
		messages: [],
		isReady: false,
		sendMessage: () => {},
		users: {},
		clearMessages: () => {},
		setUnreadMessages: () => {},
		unreadMessages: 0,
	}),
	users: {},
	flyTo: () => {},
	on: () => {},
	addShape: () => {},
	shapes: {},
	removeShape: () => {},
});

function App() {
	const universe = useRecoilValue(currentUniverseState);
	const roomId = universe.id;
	const room = useRoom(roomId, useRecoilValue(characterName) || "");
	const [unreadMessages, setUnreadMessages] = useRecoilState(
		chatUnreadsState,
	);
	return (
		<div>
			<CurrentRoomCtx.Provider value={room}>
				<Tabs
					defaultActiveKey="map"
					onSelect={(key) => {
						if (key?.startsWith("chat_")) {
							setUnreadMessages((old) => {
								const newValue = { ...old };
								newValue[key.split("chat_")[1]] = 0;
								return newValue;
							});
						}
					}}
				>
					<Tab eventKey="map" title="Map">
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
							title={
								<React.Fragment>
									{"#" + e.name + " "}
									<Badge
										style={{
											backgroundColor: "#007bff",
										}}
									>
										{unreadMessages[e.id] || ""}
									</Badge>
								</React.Fragment>
							}
							key={"chat_" + e.id}
						>
							<ChatRoom channel={e} />
						</Tab>
					))}
				</Tabs>

				<Notifications />
			</CurrentRoomCtx.Provider>
		</div>
	);
}

export default App;
