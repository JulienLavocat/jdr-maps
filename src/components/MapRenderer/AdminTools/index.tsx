import React, { useState } from "react";
import tokensIndex from "../tokens.json";
import MapSelector from "./MapSelector";
import TokenSpawner from "./TokenSpawner";
import { Button, ButtonGroup } from "react-bootstrap";

export default function AdminTools() {
	const [category, setCategory] = useState("");

	switch (category) {
		case "":
			return (
				<div>
					<Button
						className="mr-5"
						onClick={() => setCategory("tokenSpawner")}
					>
						Tokens
					</Button>
					<Button onClick={() => setCategory("mapSelector")}>
						Maps
					</Button>
				</div>
			);
		case "tokenSpawner":
			return <TokenSpawner onBack={() => setCategory("")} />;
		case "mapSelector":
			return <MapSelector onBack={() => setCategory("")} />;
		default:
			return <div>Unknown category !</div>;
	}
}
