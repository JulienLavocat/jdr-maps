import { string } from "prop-types";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isAuthenticatedState, UserState, userState } from "../../utils/state";
import { UniverseChooser } from "../UniverseChooser";

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
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useRecoilState<UserState>(userState);
	const [authError, setAuthError] = useState<any>(null);
	const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
	const history = useHistory();

	useEffect(() => {
		console.log(
			"Authenticated ?",
			isAuthenticated,
			"IsLaoding?",
			isLoading,
			"code",
			code,
		);

		if (!code && !isLoading) {
			console.log("No code");

			window.location.href =
				import.meta.env.SNOWPACK_PUBLIC_API_URL + "/auth/login";
			return;
		}

		if (code && !isLoading) {
			console.log("Require authentication");

			setIsLoading(true);
			fetch(
				`${
					import.meta.env.SNOWPACK_PUBLIC_API_URL
				}/auth/authorize/?code=${code}`,
			)
				.then((r) => r.json())
				.then((r) => {
					if (r.error) {
						setIsLoading(false);
						setAuthError(true);
						return;
					}

					setUser(r);
					setIsAuthenticated(true);
					setIsLoading(false);
				});
		}

		return () => {};
	}, [isAuthenticated, code, isLoading]);

	// useEffect(() => {
	// 	console.log(isAuthenticated, code, isLoading, user);

	// 	if (
	// 		!isAuthenticated &&
	// 		localStorage.getItem("auth.user") &&
	// 		localStorage.getItem("auth.token") &&
	// 		!isLoading
	// 	) {
	// 		console.log("Got cache !", {
	// 			user: JSON.parse(localStorage.getItem("auth.user") || ""),
	// 			token: localStorage.getItem("auth.token") || "",
	// 		});
	// 		setUser({
	// 			user: JSON.parse(localStorage.getItem("auth.user") || ""),
	// 			token: localStorage.getItem("auth.token") || "",
	// 		});
	// 		setIsAuthenticated(true);
	// 		setIsLoading(false);
	// 		return;
	// 	}

	// 	if (!isAuthenticated && !code && !isLoading) {
	// 		console.log("No code received");

	// 		window.location.href =
	// 			import.meta.env.SNOWPACK_PUBLIC_API_URL + "/auth/login";
	// 		return;
	// 	}

	// 	if (!isAuthenticated && !isLoading) {
	// 		console.log("Require authentication");

	// 		setIsLoading(true);
	// 		fetch(
	// 			import.meta.env.SNOWPACK_PUBLIC_API_URL +
	// 				"/auth/authorize/?code=" +
	// 				code,
	// 		)
	// 			.then((r) => r.json())
	// 			.then((r) => {
	// 				setIsLoading(false);
	// 				console.log("Got response", r);

	// 				if (r.error) {
	// 					setAuthError(true);
	// 					return;
	// 				}

	// 				setUser(r);
	// 				setIsAuthenticated(true);
	// 				localStorage.setItem("auth.user", JSON.stringify(r.user));
	// 				localStorage.setItem("auth.token", r.token);
	// 			});
	// 	}
	// 	return () => {};
	// }, [code, isAuthenticated, isLoading]);

	if (isAuthenticated) {
		history.push("/universes");
		return <></>;
	}

	return (
		<div style={{ height: "100%" }}>
			{isLoading ? (
				<p>Loading...</p>
			) : authError ? (
				<p>Une erreur s'est produite !</p>
			) : (
				<>{}</>
			)}
		</div>
	);
}
