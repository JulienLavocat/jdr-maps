import { useEffect, useRef, useState } from "react";
import socketIO, { Socket } from "socket.io-client";
import { senderIdState, characterName } from "../utils/state";
import { useRecoilValue } from "recoil";

const SOCKET_SERVER_URL = import.meta.env.SNOWPACK_PUBLIC_API_URL || "/api";

export interface MessageSender {
	name: string;
	id: string;
}

export interface Message {
	id: string;
	sender: MessageSender;
	content: string;
}
export interface UseChat {
	messages: Message[];
	initialize: () => void;
	isReady: boolean;
	sendMessage: (
		content: string,
		sender?: { name: string; id: string },
	) => void;
	users: Record<string, MessageSender>;
}

export const useChat: (
	socket: React.MutableRefObject<Socket | undefined>,
	id: string,
) => UseChat = (
	socket: React.MutableRefObject<Socket | undefined>,
	id: string,
) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isReady, setReady] = useState<boolean>(false);
	const [users, setUsers] = useState<Record<string, MessageSender>>({});
	const senderId = useRecoilValue<string>(senderIdState);
	const senderName = useRecoilValue<string>(characterName);

	useEffect(() => {
		socket.current?.on(
			"initialize",
			(
				channelId,
				messages: Message[],
				users: Record<string, MessageSender>,
			) => {
				if (channelId !== id) return;

				setMessages(() => messages);
				setUsers(() => users);
				setReady(true);
			},
		);

		socket.current?.on("new_message", (channelId, messages: Message[]) => {
			if (channelId !== id) return;

			setMessages(() => messages);
		});

		return () => {};
	}, [id]);

	return {
		messages,
		initialize: () => socket.current?.emit("initialize", id, senderName),
		isReady,
		sendMessage: (content: string) => {
			socket.current?.emit("send_message", id, {
				content,
				sender: {
					name: senderName,
					id: senderId,
				},
			});
		},
		users,
	};
};
