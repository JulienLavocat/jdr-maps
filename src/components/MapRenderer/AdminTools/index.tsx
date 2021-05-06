import React, { useContext, useState } from "react";
import { CurrentRoomCtx } from "../../../App";
import tokensIndex from "../tokens.json";
import TokenSpawner from "./TokenSpawner";
import MapSelector from "./MapSelector";

const tokens: Record<
	string,
	{ name: string; displayName: string; url: string }[]
> = tokensIndex as Record<
	string,
	{ name: string; displayName: string; url: string }[]
>;

const categories: string[] = Object.keys(tokens);

export default function AdminToos() {
	const [category, setCategory] = useState("");

	switch (category) {
		case "":
			return (
				<div>
					<button onClick={() => setCategory("tokenSpawner")}>
						Tokens
					</button>
					<button onClick={() => setCategory("mapSelector")}>
						Maps
					</button>
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
