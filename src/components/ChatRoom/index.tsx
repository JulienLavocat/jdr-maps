import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import ScrollableFeed from "react-scrollable-feed";
import { useRecoilValue } from "recoil";
import { UseChat } from "../../hooks/useChat";
import { CurrentRoomCtx } from "../../pages/Room/index";
import { characterName, userIdState } from "../../utils/state";
import "./chat.css";
import MessageRenderer from "./MessageRenderer";
import SendMessageBar from "./SendMessageBar";
import MessagesRenderer from "./MessagesRenderer";

export const ChatRoomCtx = createContext<UseChat>({
	sendMessage: () => {},
	clearMessages: () => {},
	initialize: () => {},
	isReady: false,
	messages: [],
	users: {},
});

export default function ChatRoom({
	channel,
}: {
	channel: { name: string; id: string };
}) {
	const name = useRecoilValue(characterName);
	const chatRoom = useContext(CurrentRoomCtx).useChat(channel.id);

	useEffect(() => {
		chatRoom.initialize();
		return () => {};
	}, []);

	return (
		<ChatRoomCtx.Provider value={chatRoom}>
			<div className="bg-light page" style={{ overflowX: "hidden" }}>
				<MessagesRenderer channel={channel} />
				<SendMessageBar />
			</div>
		</ChatRoomCtx.Provider>
	);
}

function MessagesRendererOld({
	channel,
}: {
	channel: { name: string; id: string };
}) {
	//const ref = useRef<ScrollableFeed>(null);
	const senderId = useRecoilValue(userIdState);
	const { messages, users, isReady, clearMessages } = useContext(ChatRoomCtx);

	const msgs = useMemo(() => {
		return messages.map((msg) => (
			<MessageRenderer msg={msg} senderId={senderId} users={users} />
		));
	}, [messages]);

	// useEffect(() => {
	// 	ref.current?.scrollToBottom();
	// 	return () => {};
	// }, []);

	return (
		<Row>
			<Col>
				<Container>
					<div className="d-flex align-items-center justify-content-between">
						<h3 className="text-center py-3 d-inline">
							#{channel.name + " "}
							<FaTrashAlt
								size={"1.5rem"}
								onClick={() => clearMessages()}
							/>
						</h3>
					</div>
					<ScrollableFeed className="chat">
						{isReady ? (
							msgs
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
