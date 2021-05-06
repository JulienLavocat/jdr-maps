import { LatLngExpression } from "leaflet";
import React, { createContext } from "react";
import "./App.css";
import MapRenderer from "./components/MapRenderer";
import { useRoom, UseRoom } from "./hooks/useRoom";

interface AppProps {}

export const CurrentRoomCtx = createContext<UseRoom>({
	color: "black",
	markers: [],
	tokens: [],
	addMarker: () => {},
	removeMarker: () => {},
	addToken: () => {},
	updateTokenPos: () => {},
	removeToken: () => {},
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

export default App;
