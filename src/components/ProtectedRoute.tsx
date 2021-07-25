import React, { Component, FC } from "react";
import { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthenticatedState } from "../utils/state";

type Props = {
	path: string;
	exact?: boolean;
};

const ProtectedRoute: React.FC<Props> = ({ exact, path, children }) => {
	const isAuthenticated = useRecoilValue(isAuthenticatedState);

	useEffect(() => {
		console.log("ProtectedRoute hit, ", isAuthenticated);
	});

	return isAuthenticated ? (
		<Route path={path} exact={exact}>
			{children}
		</Route>
	) : (
		<React.Fragment>
			{
				(window.location.href =
					import.meta.env.SNOWPACK_PUBLIC_API_URL + "/auth/login")
			}
			{/* <p>Need redirect</p> */}
		</React.Fragment>
	);
};

export default ProtectedRoute;
