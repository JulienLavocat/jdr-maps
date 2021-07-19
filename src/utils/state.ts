import { nanoid } from "nanoid";
import { string } from "prop-types";
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

export const isAuthenticatedState = atom<boolean>({
	key: "isAuthenticated",
	default: false,
});

export type UserState = {
	token: string;
	user: {
		id: string;
		username: string;
		avatarId: string;
		email: string;
		discordId: string;
	};
};

export const userState = atom<UserState>({
	key: "user",
	default: {
		token: "",
		user: {
			discordId: "",
			avatarId: "",
			email: "",
			username: "",
			id: "",
		},
	},
});
