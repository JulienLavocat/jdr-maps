import React, { useContext, useEffect, useState } from "react";

import { CurrentRoomCtx } from "../../../pages/Room/index";
import tokensIndex from "../tokens.json";
import { Form, Row, Col, InputGroup, Button } from "react-bootstrap";

type TokenIndex = Record<
	string,
	Record<string, { name: string; displayName: string; url: string }[]>
>;

const tokens: TokenIndex = tokensIndex as TokenIndex;

const mods: string[] = Object.keys(tokens);

export default function TokenSpawner() {
	const { addToken } = useContext(CurrentRoomCtx);

	const [mod, setMod] = useState(mods[0]);
	const [categories, setCategories] = useState<string[]>(
		Object.keys(tokens[mod]),
	);
	const [category, setCategory] = useState<string>(categories[0]);
	const [currentToken, setCurrentToken] = useState<string | null>(
		tokens[mod][category][0].url,
	);

	return (
		<Form>
			<Row>
				<Col lg={3}>
					<InputGroup>
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">
								Mod
							</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control
							as="select"
							onChange={(e) => {
								setMod(e.target.value);
								const c = Object.keys(tokens[e.target.value]);

								setCategories(c);
								setCategory(c[0]);
								setCurrentToken(
									tokens[e.target.value][c[0]][0].url,
								);
							}}
						>
							{mods.map((e) => (
								<option key={e} value={e}>
									{e}
								</option>
							))}
						</Form.Control>
					</InputGroup>
				</Col>
				<Col lg={3}>
					<InputGroup>
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">
								Categorie
							</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control
							as="select"
							onChange={(e) => {
								setCategory(e.target.value);
								setCurrentToken(
									tokens[mod][e.target.value][0].url,
								);
							}}
						>
							{categories.map((e) => (
								<option key={e} value={e}>
									{e}
								</option>
							))}
						</Form.Control>
					</InputGroup>
				</Col>
				<Col lg={4}>
					<InputGroup>
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">
								Token
							</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control
							as="select"
							onChange={(e) => {
								setCurrentToken(e.target.value);
							}}
						>
							{Object.values(tokens[mod][category]).map((e) => (
								<option key={mod + "/" + e.name} value={e.url}>
									{e.displayName}
								</option>
							))}
						</Form.Control>
					</InputGroup>
				</Col>
				<Col lg={1}>
					<Button
						variant="success"
						onClick={() => addToken([500, 500], currentToken || "")}
					>
						Add
					</Button>
				</Col>
			</Row>
			{currentToken ? (
				<img
					src={"/tokens" + currentToken}
					width={200}
					height={200}
				></img>
			) : null}
		</Form>
	);
}
