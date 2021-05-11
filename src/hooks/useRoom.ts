import { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import socketIO, { Socket } from "socket.io-client";
import { useChat, UseChat, MessageSender } from "./useChat";
import { userIdState, inAppNotifications, characterName } from "../utils/state";
import { MapData } from "../utils/MapsAPI";
import { nanoid } from "nanoid";

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
	type: string;
	status: string;
	rotation: number;
}

export interface UseRoom {
	color: string;
	markers: MarkerData[];
	tokens: TokenData[];
	addToken: (pos: LatLngExpression, imgUrl: string) => void;
	updateToken: (token: TokenData) => void;
	removeToken: (id: string) => void;
	addMarker: (pos: LatLngExpression) => void;
	removeMarker: (id: string) => void;
	currentMap: number;
	maps: MapData[];
	setCurrentMap: (map: number) => void;
	setMaps: (maps: MapData[]) => void;
	flyTo: (pos: LatLngExpression, zoom: number) => void;
	chats: { name: string; id: string }[];
	useChat: (channelId: string) => UseChat;
	users: Record<string, UserInfos>;
	on: (event: string, handler: (...args: any[]) => void) => void;
}

export type RoomEventsMap = Record<string, (...args: any[]) => void>;
export interface UserInfos {
	id: string;
	name: string;
	color: string;
}

export const useRoom: (roomId: string, name: string) => UseRoom = (
	roomId: string,
	name: string,
) => {
	const [chats, setChats] = useState<{ name: string; id: string }[]>([]);
	const [markers, setMarkers] = useState<MarkerData[]>([]);
	const [tokens, setTokens] = useState<TokenData[]>([]);
	const [currentMap, setCurrentMap] = useState(0);
	const [maps, setMaps] = useState<MapData[]>([]);
	const [users, setUsers] = useState<Record<string, UserInfos>>({});
	const socketRef = useRef<Socket>();
	const [color, setColor] = useState<string>("black");
	const [userId] = useRecoilState<string>(userIdState);
	const setIAPS = useSetRecoilState(inAppNotifications);

	useEffect(() => {
		// Creates a WebSocket connection
		socketRef.current = socketIO(SOCKET_SERVER_URL, {
			transports: ["websocket"],
			query: { roomId, userId, name },
		});

		socketRef.current.on("connect", () => {
			console.log("connected", "userId", userId);
		});

		socketRef.current.on("room_joined", (data) => {
			console.log("room joined", data);

			if (userId === data.id) setColor(data.color);
			setMarkers(Object.values(data.markers));
			setTokens(Object.values(data.tokens));
			setMaps(data.map.maps);
			setCurrentMap(data.map.current);
			setChats(data.chats);
			setUsers(data.users);

			setIAPS((old) => [
				...old,
				{
					body: data.users[data.id].name,
					duration: 5000,
					id: nanoid(),
					sentAt: new Date(),
					title: "Room joined",
				},
			]);
		});

		socketRef.current.on("markers_updated", (markers) => {
			setMarkers(() => Object.values(markers));
		});

		socketRef.current.on("tokens_updated", (tokens) => {
			setTokens(() => Object.values(tokens));
		});

		socketRef.current.on("set_current_map", (map: number) => {
			setCurrentMap(() => map);
		});

		socketRef.current.on("set_maps", (maps: MapData[]) => {
			setMaps(() => maps);
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

	const updateToken = (token: TokenData) => {
		socketRef.current?.emit("update_token", roomId, token);
	};

	const removeToken = (id: string) => {
		socketRef.current?.emit("remove_token", roomId, id);
	};

	const setMap = (mapUrl: string) => {
		socketRef.current?.emit("set_map", roomId, mapUrl);
	};

	const flyTo = (pos: LatLngExpression, zoom: number) => {
		socketRef.current?.emit("fly_to", roomId, pos, zoom);
	};

	const on = (event: string, handler: (...args: any[]) => void) => {
		socketRef.current?.on(event, (...args) => handler(...args));
	};

	return {
		color,
		markers,
		tokens,
		addMarker,
		removeMarker,
		addToken,
		updateToken,
		removeToken,
		setMap,
		chats,
		flyTo,
		useChat: (channelId: string) => useChat(socketRef, channelId),
		on,
		users,
		currentMap,
		maps,
		setCurrentMap: (map: number) =>
			socketRef.current?.emit("set_current_map", roomId, map),
		setMaps: (maps: MapData[]) =>
			socketRef.current?.emit("set_maps", roomId, maps),
	};
};
