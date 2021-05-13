import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./index.css";
import HomePage from "./pages/HomePage";
import MapUploader from "./pages/MapUploader/index";
import Room from "./pages/Room";
import RoomChooser from "./pages/RoomChooser/index";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<BrowserRouter>
				<Switch>
					<Route path="/" exact>
						<HomePage />
					</Route>
					<Route path="/maps/upload">
						<MapUploader />
					</Route>
					<Route path="/rooms/:roomId">
						<Room />
					</Route>
					<Route path="/rooms">
						<RoomChooser />
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
