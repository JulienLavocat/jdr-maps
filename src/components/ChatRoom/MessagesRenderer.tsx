import React, { useEffect, useMemo, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ScrollableFeed from "react-scrollable-feed";
import { useRecoilValue } from "recoil";
import MessageRenderer from "./MessageRenderer";
import { Message, MessageSender } from "../../hooks/useChat";
import { userIdState } from "../../utils/state";

export default function MessagesRenderer({
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
	const senderId = useRecoilValue(userIdState);

	const msgs = useMemo(() => {
		return messages.map((msg) => (
			<MessageRenderer msg={msg} senderId={senderId} users={users} />
		));
	}, [messages]);

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
