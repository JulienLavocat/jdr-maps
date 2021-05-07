import React, { useContext, useEffect, useState } from "react";
import MapsAPI from "../../../utils/MapsAPI";
import { CurrentRoomCtx } from "../../../pages/Room/index";

const API = "/api";

export default function MapSelector({ onBack }: { onBack: () => void }) {
	const setMap = useContext(CurrentRoomCtx).setMap;
	const [maps, setMaps] = useState<string[]>([]);

	useEffect(() => {
		MapsAPI.getMaps().then((res) => setMaps(res.map((e: any) => e.name)));

		return () => {};
	}, []);

	return (
		<div>
			{maps.map((e) => (
				<button key={e} onClick={() => setMap(MapsAPI.getMapUrl(e))}>
					{e}
				</button>
			))}
			<button key={"back"} onClick={onBack}>
				Return to menu
			</button>
		</div>
	);
}
