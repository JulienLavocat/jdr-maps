import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import MapsAPI from "../../utils/MapsAPI";
import {
	currentUniverseState,
	hasCurrentUniverseState,
	Universe,
	userState,
} from "../../utils/state";

export function UniverseChooser() {
	const { token } = useRecoilValue(userState);
	const setCurrentUniverse = useSetRecoilState(currentUniverseState);
	const setHasCurrentUniverse = useSetRecoilState(hasCurrentUniverseState);
	const [universes, setUniverses] = useState<Universe[]>([]);
	const history = useHistory();

	useEffect(() => {
		console.log(token);

		if (!token) history.push("/");

		MapsAPI.listUniverses(token).then((r) => {
			setUniverses(r);
		});

		return () => {};
	}, []);

	const onCurrentUniverse = (universe: Universe) => {
		setHasCurrentUniverse(true);
		setCurrentUniverse(universe);
		history.push("/universe");
	};

	return (
		<>
			<p>Universe chooser</p>
			{universes.map((e) => (
				<Button
					onClick={() => onCurrentUniverse(e)}
					variant="secondary"
				>
					{e.name}
				</Button>
			))}
		</>
	);
}
