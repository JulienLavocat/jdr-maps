import { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import socketIO, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "localhost:8082";

export const useRoom = (roomId: string) => {
	const [markers, setMarkers] = useState<
		{ id: string; pos: LatLngExpression; color: string }[]
	>([]); // Sent and received messages
	const socketRef = useRef<Socket>();
	const [color, setColor] = useState<string>("black");

	useEffect(() => {
		// Creates a WebSocket connection
		socketRef.current = socketIO(SOCKET_SERVER_URL, {
			transports: ["websocket"],
			query: { roomId },
		});

		socketRef.current.on("connect", () => {
			console.log("connected");
		});

		socketRef.current.on("room_joined", (data) => {
			console.log("room joined", data);

			if (socketRef.current?.id === data.id) setColor(data.color);

			setMarkers(data.markers);
		});

		socketRef.current.on("markers_updated", (markers) => {
			console.log(markers);
			setMarkers(() => markers);
		});

		// Destroys the socket reference
		// when the connection is closed
		return () => {
			socketRef.current?.disconnect();
		};
	}, [roomId]);

	// Sends a message to the server that
	// forwards it to all users in the same room
	const addMarker = (pos: LatLngExpression) => {
		socketRef.current?.emit("add_marker", roomId, pos, color);
	};

	const removeMarker = (id: string) => {
		console.log("remove", id);
		socketRef.current?.emit("remove_marker", roomId, id);
	};

	return { color, markers, addMarker, removeMarker };
};
