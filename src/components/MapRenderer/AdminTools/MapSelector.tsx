import React, { useContext, useEffect, useState } from "react";
import {
	Button,
	Container,
	Form,
	InputGroup,
	Row,
	Table,
} from "react-bootstrap";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { CurrentRoomCtx } from "../../../pages/Room/index";
import MapsAPI, { MapData } from "../../../utils/MapsAPI";
import { currentUniverseState } from "../../../utils/state";

export default function MapSelector() {
	const universe = useRecoilValue(currentUniverseState);
	const { maps, currentMap, setMaps, setCurrentMap } = useContext(
		CurrentRoomCtx,
	);
	const [availableMaps, setAvailableMaps] = useState<MapData[] | null>(null);
	const [selectedMap, setSelectedMap] = useState<number>(0);
	useEffect(() => {
		MapsAPI.getMaps(universe.id)
			.then((res) => {
				setAvailableMaps(res);
			})
			.catch((er) => console.error(er));

		return () => {};
	}, []);

	return (
		<Container fluid>
			<Row className="mt-3">
				<h5>Available maps</h5>
				{!availableMaps ? (
					<p>Fetching maps...</p>
				) : (
					<Form
						onSubmit={(e) => {
							e.preventDefault();
							setMaps([...maps, availableMaps[selectedMap]]);
						}}
					>
						<InputGroup as={Row} sm={2}>
							<Form.Control
								as="select"
								onChange={(e) =>
									setSelectedMap(parseInt(e.target.value))
								}
								required
							>
								{availableMaps.map((e, index) => (
									<option key={e.id} value={index}>
										{e.name}
									</option>
								))}
							</Form.Control>
							<InputGroup.Append>
								<Button variant="success" type="submit">
									Add to levels
								</Button>
							</InputGroup.Append>
						</InputGroup>
					</Form>
				)}
			</Row>
			<Row className="mt-3">
				<h5>Current level</h5>
				<p>
					{maps[currentMap]?.name} ({currentMap})
				</p>
			</Row>
			<Row className="mt-3">
				<h5>Levels</h5>
				<Row className="mx-auto">
					<Table striped>
						<thead>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Id</th>
								<th>Set current</th>
								<th>Remove ?</th>
							</tr>
						</thead>
						<tbody>
							{maps.map((e, index) => (
								<tr key={e.id}>
									<td>{index + 1}</td>
									<td>{e.name}</td>
									<td>{e.id}</td>
									<td>
										<FaCheck
											color="green"
											onClick={() => setCurrentMap(index)}
										/>
									</td>
									<td>
										<FaTrashAlt
											onClick={() => {
												const newMaps = maps.filter(
													(map) => map.id !== e.id,
												);
												if (newMaps.length === 0)
													return;

												setMaps(newMaps);

												if (
													currentMap >
													newMaps.length - 1
												)
													setCurrentMap(
														Math.max(
															0,
															newMaps.length - 1,
														),
													);
											}}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Row>
			</Row>
		</Container>
	);
}
