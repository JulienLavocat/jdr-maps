import React, { Component, FC } from "react";
import { useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
	currentUniverseState,
	hasCurrentUniverseState,
	isAuthenticatedState,
} from "../utils/state";

type Props = {
	path: string;
	exact?: boolean;
};

const UniverseRoute: React.FC<Props> = ({ exact, path, children }) => {
	const isAuthenticated = useRecoilValue(isAuthenticatedState);
	const hasCurrentUniverse = useRecoilValue(hasCurrentUniverseState);
	const history = useHistory();

	useEffect(() => {
		if (!isAuthenticated) history.push("/");
		if (!hasCurrentUniverse) history.push("/universes");
		return () => {};
	}, [isAuthenticated, hasCurrentUniverse]);

	return isAuthenticated && hasCurrentUniverse ? (
		<Route path={path} exact={exact}>
			{children}
		</Route>
	) : (
		<React.Fragment>Nothing !</React.Fragment>
	);
};

export default UniverseRoute;
