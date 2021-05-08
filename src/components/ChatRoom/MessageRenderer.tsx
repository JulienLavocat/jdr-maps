import React from "react";
import { Message, MessageSender } from "../../hooks/useChat";

export default function MessageRenderer({
	sender,
	content,
	id,
	senderId,
	users,
}: Message & { senderId: string; users: Record<string, MessageSender> }) {
	const matchAllParams = /<([^>]+)\$\_\$([^>]+)>/g;

	let gif: string | null = null;
	let isUserMentionned = false;
	for (const param of content.matchAll(matchAllParams)) {
		switch (param[1]) {
			case "@":
				if (param[2] === senderId) isUserMentionned = true;
				console.log(param[2], users[param[2]]?.name, users);

				content = replaceText(
					content,
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

		content = content.replaceAll(matchAllParams, "");
	}

	return (
		<div
			className="list-group-item"
			key={id}
			style={{
				backgroundColor: isUserMentionned ? "#fcf7c5" : undefined,
			}}
		>
			<strong>{sender.name}</strong>
			<p>{content}</p>
			{gif ? (
				<video autoPlay={true} loop={true}>
					<source src={gif} type="video/mp4" />
				</video>
			) : null}
		</div>
	);
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
