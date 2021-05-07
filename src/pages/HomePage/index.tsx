import React from "react";
import { Link } from "react-router-dom";

const pages = [
	{
		name: "Upload a map",
		path: "/maps/upload",
	},
	{
		name: "Join a room",
		path: "/rooms",
	},
];

export default function HomePage() {
	return (
		<div>
			<ul>
				{pages.map((e) => (
					<li key={e.name}>
						<Link to={e.path}>{e.name}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
