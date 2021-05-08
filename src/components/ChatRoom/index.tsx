import { nanoid } from "nanoid";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Navbar, Row } from "react-bootstrap";
import { CurrentRoomCtx } from "../../pages/Room/index";
import { Message, MessageSender } from "../../hooks/useChat";
import * as Scroll from "react-scroll";
import ScrollableFeed from "react-scrollable-feed";
import "./chat.css";
import MessageRenderer from "./MessageRenderer";
import { useRecoilValue } from "recoil";
import { senderIdState, characterName } from "../../utils/state";

export default function ChatRoom({
	channel,
}: {
	channel: { name: string; id: string };
}) {
	const name = useRecoilValue(characterName);
	const { isReady, messages, initialize, sendMessage, users } = useContext(
		CurrentRoomCtx,
	).useChat(channel.id);

	useEffect(() => {
		initialize();
		return () => {};
	}, []);

	return (
		<div className="bg-light page" style={{ overflowX: "hidden" }}>
			<MessagesRenderer
				channel={channel}
				isReady={isReady}
				messages={messages}
				users={users}
			/>
			<SendMessageBar sendMessage={sendMessage} />
		</div>
	);
}

function MessagesRenderer({
	isReady,
	channel,
	messages,
	users,
}: {
	channel: { name: string; id: string };
	messages: Message[];
	isReady: boolean;
	users: Record<string, MessageSender>;
}) {
	const ref = useRef<ScrollableFeed>(null);
	const senderId = useRecoilValue(senderIdState);

	useEffect(() => {
		ref.current?.scrollToBottom();
		return () => {};
	}, []);

	return (
		<Row>
			<Col>
				<Container>
					<div className="d-flex align-items-center justify-content-between">
						<h3 className="text-center py-3 d-inline">
							#{channel.name}
						</h3>
					</div>
					<ScrollableFeed className="chat" ref={ref}>
						{isReady ? (
							messages.map((msg) => (
								<MessageRenderer
									content={msg.content}
									id={msg.id}
									sender={msg.sender}
									senderId={senderId}
									users={users}
								/>
							))
						) : (
							<div className="text-center mt-5 pt-5">
								<p className="lead text-center">
									Fetching Messages...
								</p>
							</div>
						)}
					</ScrollableFeed>
				</Container>
			</Col>
		</Row>
	);
}

function SendMessageBar({
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
