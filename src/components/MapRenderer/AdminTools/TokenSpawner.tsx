import React, { useContext, useState } from "react";

import { CurrentRoomCtx } from "../../../pages/Room/index";
import tokensIndex from "../tokens.json";
import { Form, Row, Col, InputGroup } from "react-bootstrap";

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
	const [category, setCategory] = useState(categories[0]);

	return (
		<Form>
			<Row>
				<Col lg={3}>
					<InputGroup>
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">
								Categorie
							</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control
							as="select"
							onChange={(e) => setCategory(e.target.value)}
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
							{Object.values(tokens[category]).map((e) => (
								<option
									key={category + "/" + e.name}
									value={e.url}
								>
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
