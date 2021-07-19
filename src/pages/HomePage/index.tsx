import { string } from "prop-types";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isAuthenticatedState, UserState, userState } from "../../utils/state";

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
	const isAuthenticated = useRecoilValue(isAuthenticatedState);
	const query = new URLSearchParams(useLocation().search);
	const [code, setCode] = useState<string | null>(query.get("code"));
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useRecoilState<UserState>(userState);
	const [authError, setAuthError] = useState<any>(null);
	const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);

	useEffect(() => {
		if (
			!isAuthenticated &&
			localStorage.getItem("auth.user") &&
			localStorage.getItem("auth.token")
		) {
			console.log("Got cache !");
			setUser({
				user: JSON.parse(localStorage.getItem("auth.user") || ""),
				token: localStorage.getItem("auth.token") || "",
			});
			setIsAuthenticated(true);
			setIsLoading(false);
			return;
		}

		if (!isAuthenticated && !code) {
			window.location.href =
				import.meta.env.SNOWPACK_PUBLIC_API_URL + "/auth/login";
		}

		if (!isAuthenticated) {
			setIsLoading(true);
			fetch(
				import.meta.env.SNOWPACK_PUBLIC_API_URL +
					"/auth/authorize/?code=" +
					code,
			)
				.then((r) => r.json())
				.then((r) => {
					setIsLoading(false);

					if (r.error) {
						setAuthError(true);
						return;
					}

					setUser(r);
					setIsAuthenticated(true);
					localStorage.setItem("auth.user", JSON.stringify(r.user));
					localStorage.setItem("auth.token", r.token);
				});
		}
		return () => {};
	}, [code]);

	return (
		<div>
			{isLoading ? (
				<p>Loading...</p>
			) : authError ? (
				<p>Une erreur s'est produite !</p>
			) : (
				<>
					<ul>
						{pages.map((e) => (
							<li key={e.name}>
								<Link to={e.path}>{e.name}</Link>
							</li>
						))}
					</ul>
					<p>{JSON.stringify(user)}</p>
				</>
			)}
		</div>
	);
}
