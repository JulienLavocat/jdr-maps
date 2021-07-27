import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Card, CardColumns, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import MapsAPI from "../../utils/MapsAPI";
import {
	currentUniverseState,
	hasCurrentUniverseState,
	Universe,
	userState,
} from "../../utils/state";

export function UniverseChooser() {
	const { token } = useRecoilValue(userState);
	const setCurrentUniverse = useSetRecoilState(currentUniverseState);
	const setHasCurrentUniverse = useSetRecoilState(hasCurrentUniverseState);
	const [universes, setUniverses] = useState<Universe[]>([]);
	const history = useHistory();

	useEffect(() => {
		console.log(token);

		if (!token) history.push("/");

		MapsAPI.listUniverses(token).then((r) => {
			setUniverses(r);
		});

		return () => {};
	}, []);

	const onCurrentUniverse = (universe: Universe) => {
		setHasCurrentUniverse(true);
		setCurrentUniverse(universe);
		history.push("/universe");
	};

	return (
		<>
			<p>Universe chooser</p>
			{/* <Row xs={1} md={1} className="g-4 mx-5">
				{universes.map((e) => (
					<Col>
						<Card onClick={() => onCurrentUniverse(e)}>
							<Card.Body>
								<Card.Title>{e.name}</Card.Title>
								<Card.Text>{""}</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row> */}
			<CardColumns className="px-5 mx-5">
				{universes.map((e) => (
					<Card onClick={() => onCurrentUniverse(e)} className="my-2">
						<Card.Body>
							<Card.Title>{e.name}</Card.Title>
							<Card.Text>{""}</Card.Text>
						</Card.Body>
					</Card>
				))}
			</CardColumns>
		</>
	);
}
