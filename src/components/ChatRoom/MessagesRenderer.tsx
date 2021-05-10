import React, { useContext, useEffect, useMemo, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ScrollableFeed from "react-scrollable-feed";
import { useRecoilValue } from "recoil";
import MessageRenderer from "./MessageRenderer";
import { Message, MessageSender } from "../../hooks/useChat";
import { userIdState } from "../../utils/state";
import { FaTrashAlt } from "react-icons/fa";
import { ChatRoomCtx } from "./index";

export default function MessagesRenderer({
	channel,
}: {
	channel: { name: string; id: string };
}) {
	//const ref = useRef<ScrollableFeed>(null);
	const senderId = useRecoilValue(userIdState);
	const { messages, users, isReady, clearMessages } = useContext(ChatRoomCtx);

	const msgs = useMemo(() => {
		return messages.map((msg) => (
			<MessageRenderer
				msg={msg}
				senderId={senderId}
				users={users}
				key={msg.id}
			/>
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
