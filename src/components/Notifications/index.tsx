import React from "react";
import { useRecoilValue } from "recoil";
import InAppNotification from "./InAppNotification";
import { inAppNotifications } from "../../utils/state";

export interface IAP {
	duration: number;
	body: string;
	title: string;
	sentAt: Date;
	id: string;
}

export default function Notifications() {
	const iaps = useRecoilValue(inAppNotifications);

	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				right: 0,
			}}
		>
			{iaps.map((e) => (
				<InAppNotification
					body={e.body}
					duration={e.duration}
					sentAt={e.sentAt}
					title={e.title}
					key={e.id}
					id={e.id}
				/>
			))}
		</div>
	);
}
