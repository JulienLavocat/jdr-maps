import { nanoid } from "nanoid";
import { atom, RecoilState } from "recoil";
import { IAP } from "../components/Notifications/index";

export const characterName = atom<string | null>({
	key: "character-name-state",
	default: null,
});

export const userIdState = atom({
	key: "chat-id-state",
	default: nanoid(),
});

export const chatUnreadsState = atom<Record<string, number>>({
	key: "chat-unreads",
	default: {},
});

export const inAppNotifications = atom<IAP[]>({
	key: "iap",
	default: [],
});
