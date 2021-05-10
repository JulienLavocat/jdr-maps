import React, { useContext, useEffect, useState } from "react";
import MapsAPI from "../../../utils/MapsAPI";
import { CurrentRoomCtx } from "../../../pages/Room/index";
import { Container, Form, Col, Button } from "react-bootstrap";
import { MapPin } from "../MapPin";

const API = "/api";

export default function MapSelector() {
	const { setMap } = useContext(CurrentRoomCtx);
	const [maps, setMaps] = useState<string[] | null>(null);
	const [currentMap, setCurrentMap] = useState<string | null>(null);

	useEffect(() => {
		MapsAPI.getMaps()
			.then((res) => {
				const mapsNames = res.map((e: any) => e.name);
				setMaps(mapsNames);
				setCurrentMap(mapsNames[0]);
			})
			.catch((er) => console.error(er));

		return () => {};
	}, []);

	return (
		<Container fluid>
			{!maps ? (
				<p>Fetching maps...</p>
			) : (
				<Form
					onSubmit={() => {
						if (!currentMap) return;
						setMap(currentMap);
					}}
				>
					<Col lg={3}>
						<Form.Control
							as="select"
							onChange={(e) => setMap(e.target.value)}
						>
							{maps.map((e) => (
								<option key={e} value={e}>
									{e}
								</option>
							))}
						</Form.Control>
					</Col>
					<Col lg={3}>
						<Button variant="success">Change Map</Button>
					</Col>
				</Form>
			)}
		</Container>
	);
}
