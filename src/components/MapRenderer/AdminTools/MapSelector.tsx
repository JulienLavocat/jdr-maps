import React, { useContext, useEffect, useState } from "react";
import MapsAPI from "../../../utils/MapsAPI";
import { CurrentRoomCtx } from "../../../pages/Room/index";
import { Form } from "react-bootstrap";

const API = "/api";

export default function MapSelector() {
	const { mapUrl, setMap } = useContext(CurrentRoomCtx);
	const [maps, setMaps] = useState<string[]>([]);

	useEffect(() => {
		MapsAPI.getMaps().then((res) => {
			console.log("current map", mapUrl);
			setMaps(res.map((e: any) => e.name));
		});

		return () => {};
	}, []);

	return (
		<div>
			<Form.Control as="select" onChange={(e) => setMap(e.target.value)}>
				{maps.map((e) => (
					<option key={e} value={e}>
						{e}
					</option>
				))}
			</Form.Control>
		</div>
	);
}
