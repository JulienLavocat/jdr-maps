import React, { useEffect, useState } from "react";
import {
	Button,
	Col,
	Form,
	FormControl,
	InputGroup,
	Row,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { characterName, currentUniverseState } from "../../utils/state";

export default function RoomChooser() {
	const currentUniverse = useRecoilValue(currentUniverseState);
	const [name, setName] = useRecoilState(characterName);

	useEffect(() => {
		if (!name) setName(localStorage.getItem("character-name"));
		return () => {};
	}, []);

	const history = useHistory();

	return (
		<div>
			<ul>
				<Row sm={6}>
					<Col sm={6}>
						<Form
							onSubmit={(e) => {
								if (name === null) return;

								localStorage.setItem("character-name", name);
								e.preventDefault();
								history.push("/universe/rooms/play");
							}}
						>
							<InputGroup className="mb-3">
								<Col sm={4}>
									<FormControl
										placeholder="Character name"
										value={name || ""}
										required={true}
										onChange={(e) =>
											setName(e.target.value)
										}
									/>
								</Col>

								<InputGroup.Append>
									<Button variant="success" type="submit">
										Rejoindre
									</Button>
								</InputGroup.Append>
							</InputGroup>
						</Form>
					</Col>
				</Row>
			</ul>
		</div>
	);
}
