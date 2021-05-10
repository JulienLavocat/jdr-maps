import React from "react";
import { Message, MessageSender } from "../../hooks/useChat";
import humanizeDuration from "humanize-duration";

export default function MessageRenderer({
	msg,
	senderId,
	users,
}: {
	msg: Message;
	senderId: string;
	users: Record<string, MessageSender>;
}) {
	const matchAllParams = /<([^>]+)\$\_\$([^>]+)>/g;

	let gif: string | null = null;
	let isUserMentionned = false;
	for (const param of msg.content.matchAll(matchAllParams)) {
		switch (param[1]) {
			case "@":
				if (param[2] === senderId) isUserMentionned = true;

				msg.content = replaceText(
					msg.content,
					param.index || 0,
					users[param[2]]?.name || "Unknown",
					param[2].length,
					6, // <> + delimiter
				);

				break;

			case "gif":
				gif = param[2];

			default:
				break;
		}

		msg.content = msg.content.replaceAll(matchAllParams, "");
	}

	console.log(!!gif, isUserMentionned);

	return (
		<div
			className="list-group-item"
			key={msg.id}
			style={{
				backgroundColor: isUserMentionned ? "#fcf7c5" : undefined,
			}}
		>
			<p>
				<strong>{msg.sender.name} </strong>
				<small>{formatDate(msg.sentAt || 0)}</small>
			</p>
			<p>{msg.content}</p>
			{gif ? <Gif src={gif} /> : null}
		</div>
	);
}

function Gif({ src }: { src: string }) {
	console.log("Rendering gif,", src);

	return (
		<video autoPlay={true} loop={true}>
			<source src={src} type="video/mp4" />
		</video>
	);
}

function formatDate(dateValue: number) {
	const date = new Date(dateValue);
	const now = new Date();
	if (
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === date.getFullYear()
	) {
		if (date.getDate() === now.getDate())
			return `— Aujourd’hui à ${date.getHours()}h${date.getMinutes()}`;
		if (date.getDate() === now.getDate() - 1)
			return `— Hier à ${date.getHours()}h${date.getMinutes()}`;
	} else {
		return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
	}
}

function replaceText(
	base: string,
	start: number,
	value: string,
	length: number,
	offset: number = 0,
) {
	return base.substr(0, start) + value + base.substr(start + length + offset);
}
