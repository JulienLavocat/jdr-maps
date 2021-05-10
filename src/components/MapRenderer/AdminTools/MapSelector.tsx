import React, { useContext, useEffect, useState } from "react";
import MapsAPI from "../../../utils/MapsAPI";
import { CurrentRoomCtx } from "../../../pages/Room/index";
import { Container, Form } from "react-bootstrap";

const API = "/api";

export default function MapSelector() {
	const { mapUrl, setMap } = useContext(CurrentRoomCtx);
	const [maps, setMaps] = useState<string[]>([]);

	useEffect(() => {
		MapsAPI.getMaps().then((res) => {
			setMaps(res.map((e: any) => e.name));
		});

		return () => {};
	}, []);

	return (
		<Container fluid>
			<Form.Control as="select" onChange={(e) => setMap(e.target.value)}>
				{maps.map((e) => (
					<option key={e} value={e}>
						{e}
					</option>
				))}
			</Form.Control>
		</Container>
	);
}
