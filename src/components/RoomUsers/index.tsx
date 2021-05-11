import React, { useContext } from "react";
import { Container, Table } from "react-bootstrap";
import { CurrentRoomCtx } from "../../pages/Room/index";
import { UserInfos } from "../../hooks/useRoom";

export default function RoomUsers() {
	const { users } = useContext(CurrentRoomCtx);

	return (
		<Container fluid>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Name</th>
						<th>Color</th>
						<th>Id</th>
					</tr>
				</thead>
				<tbody>
					{Object.values(users).map((e) => (
						<User user={e} key={e.id} />
					))}
				</tbody>
			</Table>
		</Container>
	);
}

function User({ user }: { user: UserInfos }) {
	return (
		<tr>
			<td>{user.name}</td>
			<td>{user.color}</td>
			<td>{user.id}</td>
		</tr>
	);
}
