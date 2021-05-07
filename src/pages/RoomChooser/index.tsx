import React from "react";
import { Link } from "react-router-dom";

export default function RoomChooser() {
	const rooms = ["jdr"];

	return (
		<div>
			<ul>
				{rooms.map((e) => (
					<li key={e}>
						<Link to={`/rooms/${e}`}>{e}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
