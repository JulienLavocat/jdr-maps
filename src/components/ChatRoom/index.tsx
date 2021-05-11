import React, { createContext, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useInView } from "react-intersection-observer";
import { UseChat } from "../../hooks/useChat";
import { CurrentRoomCtx } from "../../pages/Room/index";
import "./chat.css";
import MessagesRenderer from "./MessagesRenderer";
import SendMessageBar from "./SendMessageBar";

export const ChatRoomCtx = createContext<UseChat>({
	sendMessage: () => {},
	clearMessages: () => {},
	initialize: () => {},
	isReady: false,
	messages: [],
	users: {},
	// unreadMessages: 0,
	// setUnreadMessages: () => {},
});

export default function ChatRoom({
	channel,
}: {
	channel: { name: string; id: string };
}) {
	const chatRoom = useContext(CurrentRoomCtx).useChat(channel.id);
	const { inView, ref } = useInView({
		triggerOnce: true,
	});

	useEffect(() => {
		chatRoom.initialize();
		return () => {};
	}, []);

	return (
		<ChatRoomCtx.Provider value={chatRoom}>
			<Container fluid className="bg-light page max-height" ref={ref}>
				<MessagesRenderer channel={channel} />
				<SendMessageBar />
			</Container>
		</ChatRoomCtx.Provider>
	);
}
