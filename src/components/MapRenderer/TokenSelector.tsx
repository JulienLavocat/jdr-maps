import { map } from "leaflet";
import React, { useContext, useState } from "react";
import { CurrentRoomCtx } from "../../App";
import tokensIndex from "./tokens.json";

const tokens: Record<
	string,
	{ name: string; displayName: string; url: string }[]
> = tokensIndex as Record<
	string,
	{ name: string; displayName: string; url: string }[]
>;

const categories: string[] = Object.keys(tokens);

export default function TokenSpawner() {
	const { addToken } = useContext(CurrentRoomCtx);
	const [category, setCategory] = useState("");

	return (
		<div>
			{category === "" ? (
				categories.map((e) => (
					<button onClick={() => setCategory(e)} key={e}>
						{e}
					</button>
				))
			) : (
				<div>
					{Object.values(tokens[category]).map((e) => (
						<button
							onClick={() => addToken([500, 500], e.url)}
							key={category + "/" + e.name}
						>
							{e.displayName}
						</button>
					))}
					<button onClick={() => setCategory("")} key="back">
						Back
					</button>
				</div>
			)}
		</div>
	);
}
