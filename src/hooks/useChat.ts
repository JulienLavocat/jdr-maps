import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Socket } from "socket.io-client";
import { characterName, chatUnreadsState, userIdState } from "../utils/state";
export interface MessageSender {
	name: string;
	id: string;
}

export interface Message {
	id: string;
	sentAt?: number;
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
	clearMessages: () => void;
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
	const senderId = useRecoilValue<string>(userIdState);
	const senderName = useRecoilValue<string | null>(characterName);
	const [unreadMessages, setUnreadMessages] = useRecoilState(
		chatUnreadsState,
	);

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
				setUnreadMessages((old) => {
					const newValue = { ...old };
					newValue[id] = 0;
					return newValue;
				});
			},
		);

		socket.current?.on(
			"new_user",
			(channelId, users: Record<string, MessageSender>) => {
				if (channelId !== id) return;
				setUsers(() => users);
			},
		);

		socket.current?.on(
			"new_message",
			(channelId, amount: number, messages: Message[]) => {
				if (channelId !== id) return;
				setMessages(() => messages);
				setUnreadMessages((old) => {
					const newValue = { ...old };
					newValue[id] =
						newValue[id] +
						messages
							.slice(-amount)
							.filter((e) => e.sender.id !== senderId).length;
					return newValue;
				});
			},
		);

		socket.current?.on("clear_messages", (channelId) => {
			if (channelId !== id) return;
			setMessages(() => []);
			setUnreadMessages((old) => {
				const newValue = { ...old };
				newValue[id] = Math.max(0, newValue[id] - messages.length);
				return newValue;
			});
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
		clearMessages: () => socket.current?.emit("clear_messages", id),
		users,
		unreadMessages,
		setUnreadMessages,
	};
};
