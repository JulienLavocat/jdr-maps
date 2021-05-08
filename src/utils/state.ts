import { nanoid } from "nanoid";
import { atom } from "recoil";

export const characterName = atom({
	key: "character-name-state",
	default: "",
});

export const userIdState = atom({
	key: "chat-id-state",
	default: nanoid(),
});
