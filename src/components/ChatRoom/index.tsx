import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { Col, Container, Row, Toast } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import ScrollableFeed from "react-scrollable-feed";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { UseChat } from "../../hooks/useChat";
import { CurrentRoomCtx } from "../../pages/Room/index";
import {
	characterName,
	userIdState,
	chatUnreadsState,
} from "../../utils/state";
import "./chat.css";
import MessageRenderer from "./MessageRenderer";
import SendMessageBar from "./SendMessageBar";
import MessagesRenderer from "./MessagesRenderer";
import { useInView } from "react-intersection-observer";
import InAppNotification from "../Notifications/InAppNotification";

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
			<Container fluid className="bg-light page" ref={ref}>
				<MessagesRenderer channel={channel} />
				<SendMessageBar />
			</Container>
		</ChatRoomCtx.Provider>
	);
}
