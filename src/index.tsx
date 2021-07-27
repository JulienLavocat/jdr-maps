import React from "react";
import ReactDOM from "react-dom";
import {
	BrowserRouter,
	HashRouter,
	MemoryRouter,
	Route,
	Switch,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./index.css";
import HomePage from "./pages/HomePage";
import MapUploader from "./pages/MapUploader/index";
import Room from "./pages/Room";
import RoomChooser from "./pages/RoomChooser/index";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoute from "./components/ProtectedRoute";
import UniverseRoute from "./components/UniverseRoute";
import { UniverseChooser } from "./pages/UniverseChooser";
import UniversePage from "./pages/Universe";

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<BrowserRouter>
				<Switch>
					<Route path="/" exact>
						<HomePage />
					</Route>
					<ProtectedRoute path="/universes" exact>
						<UniverseChooser />
					</ProtectedRoute>
					<UniverseRoute path="/universe" exact>
						<UniversePage />
					</UniverseRoute>
					<UniverseRoute path="/universe/maps/upload">
						<MapUploader />
					</UniverseRoute>
					<UniverseRoute path="/universe/rooms/play">
						<Room />
					</UniverseRoute>
					<UniverseRoute path="/universe/rooms">
						<RoomChooser />
					</UniverseRoute>
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
