import React, { useContext, useState } from "react";

import { CurrentRoomCtx } from "../../../pages/Room/index";
import tokensIndex from "../tokens2.json";
import { Form, Row, Col, InputGroup } from "react-bootstrap";

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
	const [category, setCategory] = useState<string>(
		Object.keys(tokens[mod])[0],
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
								addToken([500, 500], e.target.value);
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
			</Row>
		</Form>
	);
}
