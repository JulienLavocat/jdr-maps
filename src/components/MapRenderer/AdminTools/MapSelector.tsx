import React, { useContext } from "react";
import { CurrentRoomCtx } from "../../../App";

export default function MapSelector({ onBack }: { onBack: () => void }) {
	const setMap = useContext(CurrentRoomCtx).setMap;
	const maps = ["/maps/1.png", "/maps/Garde.jpg"];
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
