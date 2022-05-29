import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import MessageHubStore from "./messageHubStore";
import ModalStore from "./modalStore";
import PeerStore from "./peerStore";
import PresenceHubStore from "./presenceHubStore";
import UserStore from "./userStore";

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    presenceHubStore: PresenceHubStore;
    peerStore: PeerStore;
    modalStore: ModalStore;
    messageHubStore: MessageHubStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    presenceHubStore: new PresenceHubStore(),
    peerStore: new PeerStore(),
    modalStore: new ModalStore(),
    messageHubStore: new MessageHubStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}