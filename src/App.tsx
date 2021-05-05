import React, { createContext, useEffect } from "react";
import { ReadyState, useSocketIO } from "react-use-websocket";
import "./App.css";
import MapRenderer from "./MapRenderer";
import { io } from "socket.io-client";
import type { RouteComponentProps } from "react-router";
import { useRoom } from "./hooks/useRoom";
import { LatLngExpression } from "leaflet";

interface AppProps {}

const connectionStatus = {
	[ReadyState.CONNECTING]: "Connecting",
	[ReadyState.OPEN]: "Open",
	[ReadyState.CLOSING]: "Closing",
	[ReadyState.CLOSED]: "Closed",
	[ReadyState.UNINSTANTIATED]: "Uninstantiated",
};

export const CurrentRoomCtx = createContext<{
	color: string;
	markers: { id: string; pos: LatLngExpression; color: string }[];
	addMarker: (pos: LatLngExpression) => void;
	removeMarker: (id: string) => void;
}>({
	color: "black",
	markers: [],
	addMarker: () => {},
	removeMarker: (id: string) => {},
});

function App() {
	const room = useRoom("jdr");

	return (
		<div>
			<CurrentRoomCtx.Provider value={room}>
				<MapRenderer />
			</CurrentRoomCtx.Provider>
		</div>
	);
}

function WebsocketHandler({ roomId }: { roomId: string }) {
	// useEffect(() => {
	// 	const socket = io("localhost:8082", {
	// 		transports: ["websocket"],
	// 	});

	// 	socket.on("connect", () => {
	// 		socket.emit("join", roomId);
	// 	});

	// 	socket.on("connect_error", (err) => {
	// 		console.log("error", err);
	// 	});

	// 	socket.on("joined", (id) => {
	// 		console.log("Joined room", id);
	// 	});

	// 	return () => {};
	// }, []);

	return null;
}

export default App;
