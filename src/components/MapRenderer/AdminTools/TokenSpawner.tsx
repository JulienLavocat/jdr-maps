import React, { useContext, useState } from "react";
import tokensIndex from "../tokens.json";
import { CurrentRoomCtx } from "../../../pages/Room/index";

const tokens: Record<
	string,
	{ name: string; displayName: string; url: string }[]
> = tokensIndex as Record<
	string,
	{ name: string; displayName: string; url: string }[]
>;

const categories: string[] = Object.keys(tokens);

export default function TokenSpawner({ onBack }: { onBack: () => void }) {
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
			<button onClick={onBack}>Back to menu</button>
		</div>
	);
}
