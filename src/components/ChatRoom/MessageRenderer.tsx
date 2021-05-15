import React from "react";
import { useInView } from "react-intersection-observer";
import { Message, MessageSender } from "../../hooks/useChat";

export default function MessageRenderer({
	msg,
	senderId,
	users,
}: {
	msg: Message;
	senderId: string;
	users: Record<string, MessageSender>;
}) {
	const matchAllParams = new RegExp("<([^>]+)\\$\\_\\$([^>]+)>", "g");

	let gif: string | null = null;
	let isUserMentionned = false;
	let renderedContent = msg.content;

	for (const param of msg.content.matchAll(matchAllParams)) {
		switch (param[1]) {
			case "@":
				if (param[2] === senderId) isUserMentionned = true;

				renderedContent = replaceText(
					renderedContent,
					param.index || 0,
					users[param[2]]?.name || "Unknown",
					param[2].length,
					6, // <> + delimiter (3)
				);

				break;

			case "gif":
				gif = param[2];

			default:
				break;
		}

		renderedContent = renderedContent.replaceAll(matchAllParams, "");
	}

	if (msg.to && msg.to !== senderId) return null;

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
			<p>{renderedContent}</p>
			{gif ? <Gif src={gif} /> : null}
		</div>
	);
}

function Gif({ src }: { src: string }) {
	const { ref, inView, entry } = useInView();
	if (entry)
		entry.isIntersecting
			? (entry.target as HTMLVideoElement).play()
			: (entry.target as HTMLVideoElement).play();

	return (
		<video autoPlay={inView} loop={inView} ref={ref}>
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
