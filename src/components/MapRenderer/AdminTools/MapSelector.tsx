import React, { useContext, useEffect, useState } from "react";
import { CurrentRoomCtx } from "../../../App";

const API = "/api";

export default function MapSelector({ onBack }: { onBack: () => void }) {
	const setMap = useContext(CurrentRoomCtx).setMap;
	const [maps, setMaps] = useState([]);

	useEffect(() => {
		fetch(API + "/maps")
			.then((r) => r.json())
			.then((res) => setMaps(res.map((e: any) => e.name)));

		return () => {};
	}, []);

	// const maps = ["/maps/1.png", "/maps/Garde.jpg"];
	return (
		<div>
			{maps.map((e) => (
				<button key={e} onClick={() => setMap(e)}>
					{e}
				</button>
			))}
			<button key={"back"} onClick={onBack}>
				Return to menu
			</button>
		</div>
	);
}
