import { Icon, LatLngExpression, LeafletEventHandlerFnMap } from "leaflet";
import { RotatedMarker as LeafletRotatedMaker } from "leaflet-marker-rotation";
import React, { useContext, useMemo, useRef } from "react";
import { Form, Row } from "react-bootstrap";
import { Popup } from "react-leaflet";
import { CurrentRoomCtx } from "../../pages/Room/index";
import { RotatedMarker } from "./RotatedMarker";
import "./rotation.css";
import { TokenData } from "../../hooks/useRoom";

const API = import.meta.env.SNOWPACK_PUBLIC_API_URL;

const TYPES = ["ally", "neutral", "enemy"];
const STATUS = ["dead", "alive"];

export default function MapToken({
	pos,
	id,
	imgUrl,
	size,
	rotation,
	status,
	type,
	ownerId,
}: TokenData) {
	const { updateToken, removeToken, addToken } = useContext(CurrentRoomCtx);
	const markerRef = useRef<LeafletRotatedMaker>(null);
	const eventHandlers = useMemo<LeafletEventHandlerFnMap>(
		() => ({
			keyup(e) {
				switch (e.originalEvent.key) {
					case "Backspace":
						removeToken(id);
						break;

					case "r":
						const newRotation = rotation + 45;
						updateToken({
							id,
							imgUrl,
							ownerId,
							pos,
							rotation: newRotation,
							size,
							status,
							type,
						});
						break;

					default:
						break;
				}
			},
			dblclick() {
				addToken({
					imgUrl,
					ownerId,
					pos,
					rotation,
					size,
					status,
					type,
				} as any);
			},
			dragend() {
				const marker = markerRef.current;

				if (marker != null) {
					updateToken({
						id,
						imgUrl,
						ownerId,
						pos: marker.getLatLng(),
						rotation,
						size,
						status,
						type,
					});
				}
			},
		}),
		[rotation, pos],
	);

	const getTokenUrl = () =>
		`${API}/tokens/${imgUrl
			.replace(/\//g, "$")
			.replace("$", "")}/${status}/${type}`;

	return (
		<RotatedMarker
			draggable={true}
			eventHandlers={eventHandlers}
			position={pos}
			ref={markerRef}
			icon={makeMarkerIcon(getTokenUrl(), size)}
			rotationAngle={rotation}
			rotationOrigin="center"
		>
			<Popup>
				<Form>
					<Row>
						<Form.Control
							as="select"
							onChange={(e) => {
								updateToken({
									id,
									imgUrl,
									ownerId,
									pos,
									rotation,
									size,
									status: e.target.value,
									type,
								});
							}}
							value={status}
						>
							{STATUS.map((e) => (
								<option key={e} value={e}>
									{e}
								</option>
							))}
						</Form.Control>
						<Form.Control
							as="select"
							onChange={(e) => {
								updateToken({
									id,
									imgUrl,
									ownerId,
									pos,
									rotation,
									size,
									status,
									type: e.target.value,
								});
							}}
							value={type}
						>
							{TYPES.map((e) => (
								<option key={e} value={e}>
									{e}
								</option>
							))}
						</Form.Control>
					</Row>
				</Form>
			</Popup>
		</RotatedMarker>
	);
}

const makeMarkerIcon = (iconUrl: string, size: number) =>
	new Icon({
		iconUrl,
		// shadowUrl:
		// 	"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
		iconSize: [size, size],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [size, size],
		pane: "",
	});
