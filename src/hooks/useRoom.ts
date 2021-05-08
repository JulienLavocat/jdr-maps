import { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import socketIO, { Socket } from "socket.io-client";
import { useChat, UseChat, MessageSender } from "./useChat";
import { userIdState } from "../utils/state";

const SOCKET_SERVER_URL = import.meta.env.SNOWPACK_PUBLIC_API_URL || "/api";

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
	mapUrl: string;
	markers: MarkerData[];
	tokens: TokenData[];
	addToken: (pos: LatLngExpression, imgUrl: string) => void;
	updateTokenPos: (tokenId: string, pos: LatLngExpression) => void;
	removeToken: (id: string) => void;
	addMarker: (pos: LatLngExpression) => void;
	removeMarker: (id: string) => void;
	setMap: (mapUrl: string) => void;
	chats: { name: string; id: string }[];
	useChat: (channelId: string) => UseChat;
}

export const useRoom: (roomId: string) => UseRoom = (roomId: string) => {
	const [chats, setChats] = useState<{ name: string; id: string }[]>([]);
	const [markers, setMarkers] = useState<MarkerData[]>([]);
	const [tokens, setTokens] = useState<TokenData[]>([]);
	const [mapUrl, setMapUrl] = useState<string>("");
	const socketRef = useRef<Socket>();
	const [color, setColor] = useState<string>("black");
	const [userId] = useRecoilState<string>(userIdState);

	useEffect(() => {
		// Creates a WebSocket connection
		socketRef.current = socketIO(SOCKET_SERVER_URL, {
			transports: ["websocket"],
			query: { roomId, userId },
		});

		socketRef.current.on("connect", () => {
			console.log("connected", "userId", userId);
		});

		socketRef.current.on("room_joined", (data) => {
			console.log("room joined", data);

			if (userId === data.id) setColor(data.color);
			setMarkers(Object.values(data.markers));
			setTokens(Object.values(data.tokens));
			setMapUrl(data.mapUrl);
			setChats(data.chats);
		});

		socketRef.current.on("markers_updated", (markers) => {
			setMarkers(() => Object.values(markers));
		});

		socketRef.current.on("tokens_updated", (tokens) => {
			setTokens(() => Object.values(tokens));
		});

		socketRef.current.on("set_map", (mapUrl: string) => {
			setMapUrl(() => mapUrl);
		});

		return () => {
			socketRef.current?.disconnect();
		};
	}, [roomId]);

	const addMarker = (pos: LatLngExpression) => {
		socketRef.current?.emit("add_marker", roomId, pos, color);
	};

	const removeMarker = (id: string) => {
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

	const setMap = (mapUrl: string) => {
		socketRef.current?.emit("set_map", roomId, mapUrl);
	};

	const summonTo = (pos: LatLngExpression) => {
		socketRef.current?.emit("summon_to", roomId, pos);
	};

	return {
		mapUrl,
		color,
		markers,
		tokens,
		addMarker,
		removeMarker,
		addToken,
		updateTokenPos,
		removeToken,
		setMap,
		chats,
		useChat: (channelId: string) => useChat(socketRef, channelId),
	};
};
