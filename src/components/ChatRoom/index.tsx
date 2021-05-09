import React, { useContext, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { CurrentRoomCtx } from "../../pages/Room/index";
import { characterName } from "../../utils/state";
import "./chat.css";
import MessagesRenderer from "./MessagesRenderer";
import SendMessageBar from "./SendMessageBar";

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
