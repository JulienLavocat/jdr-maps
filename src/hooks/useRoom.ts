import { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import socketIO, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "localhost:8082";

export interface MarkerData {
	id: string;
	pos: LatLngExpression;
	color: string;
	ownerId: string;
}

export interface TokenData {
	id: string;
	pos: LatLngExpression;
	ownerId: string;
	imgUrl: string;
	size: number;
}

export interface UseRoom {
	color: string;
	markers: MarkerData[];
	tokens: TokenData[];
	addToken: (pos: LatLngExpression, imgUrl: string) => void;
	updateTokenPos: (tokenId: string, pos: LatLngExpression) => void;
	removeToken: (id: string) => void;
	addMarker: (pos: LatLngExpression) => void;
	removeMarker: (id: string) => void;
}

export const useRoom: (roomId: string) => UseRoom = (roomId: string) => {
	const [markers, setMarkers] = useState<MarkerData[]>([]);
	const [tokens, setTokens] = useState<TokenData[]>([]);
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
			setTokens(data.tokens);
		});

		socketRef.current.on("markers_updated", (markers) => {
			setMarkers(() => markers);
		});

		socketRef.current.on("tokens_updated", (tokens) => {
			setTokens(() => tokens);
		});

		return () => {
			socketRef.current?.disconnect();
		};
	}, [roomId]);

	const addMarker = (pos: LatLngExpression) => {
		socketRef.current?.emit("add_marker", roomId, pos, color);
	};

	const removeMarker = (id: string) => {
		console.log("remove", id);
		socketRef.current?.emit("remove_marker", roomId, id);
	};

	const addToken = (pos: LatLngExpression, imgUrl: string) => {
		socketRef.current?.emit("add_token", roomId, pos, imgUrl);
	};

	const updateTokenPos = (tokenId: string, pos: LatLngExpression) => {
		socketRef.current?.emit("update_token_pos", roomId, tokenId, pos);
	};

	const removeToken = (id: string) => {
		socketRef.current?.emit("remove_token", roomId, id);
	};

	return {
		color,
		markers,
		tokens,
		addMarker,
		removeMarker,
		addToken,
		updateTokenPos,
		removeToken,
	};
};
