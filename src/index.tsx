import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Router, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Room from "./pages/Room";
import "./index.css";
import MapUploader from "./pages/MapUploader.tsx/index";
import HomePage from "./pages/HomePage";
import RoomChooser from "./pages/RoomChooser/index";
import MapRenderer from "./components/MapRenderer/index";

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<BrowserRouter>
				<Switch>
					<Route path="/maps/upload">
						<MapUploader />
					</Route>
					<Route path="/rooms/:roomId">
						<Room />
					</Route>
					<Route path="/rooms">
						<RoomChooser />
					</Route>
					<Route path="/">
						<HomePage />
					</Route>
				</Switch>
			</BrowserRouter>
		</RecoilRoot>
	</React.StrictMode>,
	document.getElementById("root"),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
	import.meta.hot.accept();
}
