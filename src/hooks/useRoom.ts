import { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import socketIO, { Socket } from "socket.io-client";
import { useChat, UseChat, MessageSender } from "./useChat";
import { userIdState, inAppNotifications, characterName } from "../utils/state";
import { MapData } from "../utils/MapsAPI";
import { nanoid } from "nanoid";

const SOCKET_SERVER_URL = import.meta.env.SNOWPACK_PUBLIC_SOCKET_SERVER;

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

export interface ShapeData {
	id: string;
	type: string;
	pos: LatLngExpression;
	ownerId: string;
	shape: Record<string, any>;
	color: string;
}

export interface UseRoom {
	color: string;
	markers: Record<string, MarkerData>;
	tokens: Record<string, TokenData>;
	addToken: (token: TokenData) => void;
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
	addShape: (shape: ShapeData) => void;
	shapes: Record<string, ShapeData>;
	removeShape: (shapeId: string) => void;
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
	const [markers, setMarkers] = useState<Record<string, MarkerData>>({});
	const [tokens, setTokens] = useState<Record<string, TokenData>>({});
	const [shapes, setShapes] = useState<Record<string, ShapeData>>({});
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
			setMarkers(data.markers);
			setTokens(data.tokens);
			setMaps(data.map.maps);
			setCurrentMap(data.map.current);
			setChats(data.chats);
			setUsers(data.users);
			setShapes(data.shapes);

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
			setMarkers(() => markers);
		});

		socketRef.current.on("markers_single_updated", (marker) => {
			setMarkers((old) => ({ ...old, [marker.id]: marker }));
		});
		socketRef.current.on("tokens_single_updated", (token) => {
			setTokens((old) => ({ ...old, [token.id]: token }));
		});
		socketRef.current.on("tokens_updated", (tokens) => {
			setTokens(() => tokens);
		});

		socketRef.current.on("shapes_updated", (shapes) => {
			setShapes(() => shapes);
		});

		socketRef.current.on("shapes_single_updated", (shape) => {
			setShapes((old) => ({ ...old, [shape.id]: shape }));
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

	const addToken = (token: TokenData) => {
		socketRef.current?.emit("add_token", roomId, token);
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
		addShape: (shape: ShapeData) =>
			socketRef.current?.emit("add_shape", roomId, shape),
		shapes,
		removeShape: (shapeId: string) =>
			socketRef.current?.emit("remove_shape", roomId, shapeId),
	};
};
