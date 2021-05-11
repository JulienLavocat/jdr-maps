import React, { useState } from "react";
import { Toast } from "react-bootstrap";
import { useSetRecoilState } from "recoil";
import { inAppNotifications } from "../../utils/state";
import { IAP } from "./index";

export default function InAppNotification({
	duration,
	body,
	title,
	sentAt,
	id,
}: IAP) {
	const [show, setShow] = useState(true);
	const setIAPS = useSetRecoilState(inAppNotifications);
	return (
		<div>
			<Toast
				onClose={() => {
					setShow(false);
					setIAPS((old) => old.filter((e) => e.id !== id));
				}}
				show={show}
				delay={duration}
				autohide
			>
				<Toast.Header>
					<strong className="mr-auto">{title + "  "}</strong>
					<small>
						{sentAt.getHours() + "h" + sentAt.getMinutes()}
					</small>
				</Toast.Header>
				<Toast.Body>{body}</Toast.Body>
			</Toast>
		</div>
	);
}
