import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	ImageOverlay,
} from "react-leaflet";
import MapRenderer from "./MapRenderer";
import { CRS, LatLngBounds } from "leaflet";

interface AppProps {}

function App({}: AppProps) {
	return (
		<MapContainer center={[500, 500]} zoom={1} crs={CRS.Simple}>
			<ImageOverlay
				bounds={new LatLngBounds([0, 0], [1000, 1000])}
				url="/map_collier.png"
			/>
		</MapContainer>
	);
}

export default App;
