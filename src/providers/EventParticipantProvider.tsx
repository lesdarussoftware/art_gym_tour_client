import { createContext, useState, ReactNode, SetStateAction, Dispatch } from "react";

import { EventParticipant } from "../helpers/types";

type EventParticipantContextType = {
    eventParticipants: EventParticipant[];
    setEventParticipants: Dispatch<SetStateAction<EventParticipant[]>>;
};

export const EventParticipantContext = createContext<EventParticipantContextType>({
    eventParticipants: [],
    setEventParticipants: () => { }
});

type EventParticipantProviderProps = {
    children: ReactNode;
};

export function EventParticipantProvider({ children }: EventParticipantProviderProps) {

    const [eventParticipants, setEventParticipants] = useState<EventParticipant[]>([]);

    return (
        <EventParticipantContext.Provider value={{ eventParticipants, setEventParticipants }}>
            {children}
        </EventParticipantContext.Provider>
    );
}
