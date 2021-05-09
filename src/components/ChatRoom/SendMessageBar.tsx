import React, { useState } from "react";
import { Button, Container, Form, Navbar } from "react-bootstrap";

export default function SendMessageBar({
	sendMessage,
}: {
	sendMessage: (content: string) => void;
}) {
	const [newMessage, setNewMessage] = useState("");
	return (
		<Navbar fixed="bottom">
			<Container>
				<Form
					inline
					className="w-100 d-flex justify-content-between align-items-center"
					onSubmit={(e) => {
						e.preventDefault();
						sendMessage(newMessage);
						setNewMessage("");
					}}
				>
					<Form.Group style={{ flex: 1 }}>
						<Form.Control
							value={newMessage}
							style={{ width: "100%" }}
							required
							type="text"
							placeholder="Type Message here..."
							onChange={(e) => setNewMessage(e.target.value)}
						/>
					</Form.Group>
					<Button variant="primary" type="submit">
						Send
					</Button>
				</Form>
			</Container>
		</Navbar>
	);
}
