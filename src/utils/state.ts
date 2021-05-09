import { nanoid } from "nanoid";
import { atom } from "recoil";

export const characterName = atom<string | null>({
	key: "character-name-state",
	default: null,
});

export const userIdState = atom({
	key: "chat-id-state",
	default: nanoid(),
});
