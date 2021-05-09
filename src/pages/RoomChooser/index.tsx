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
import { useRecoilState } from "recoil";
import { characterName } from "../../utils/state";

export default function RoomChooser() {
	const rooms = ["jdr"];
	const [room, setRoom] = useState(rooms[0]);
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
								history.push("/rooms/" + room);
							}}
						>
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<Form.Control
										as="select"
										value={room}
										onChange={(e) => {
											setRoom(e.target.value);
										}}
									>
										{rooms.map((e) => (
											<option key={e} value={e}>
												{e}
											</option>
										))}
									</Form.Control>
								</InputGroup.Prepend>
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
