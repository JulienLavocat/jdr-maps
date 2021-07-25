import { string } from "prop-types";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	currentUniverseState,
	isAuthenticatedState,
	UserState,
	userState,
} from "../../utils/state";

const pages = [
	{
		name: "Upload a map",
		path: "/universe/maps/upload",
	},
	{
		name: "Join a room",
		path: "/universe/rooms",
	},
];

export default function UniversePage() {
	const [isLoading, setIsLoading] = useState(true);
	const { user, token } = useRecoilValue(userState);
	const universe = useRecoilValue(currentUniverseState);

	useEffect(() => {
		setIsLoading(false);

		return () => {};
	}, []);

	return (
		<div>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<>
					<ul>
						{pages.map((e) => (
							<li>
								<Link to={e.path}>{e.name}</Link>
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
}
