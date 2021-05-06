import { LatLngExpression } from "leaflet";
import React, { createContext } from "react";
import "./App.css";
import MapRenderer from "./components/MapRenderer";
import { useRoom } from "./hooks/useRoom";

interface AppProps {}

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

export default App;
