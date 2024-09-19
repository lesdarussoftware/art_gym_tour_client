import { useContext, useState } from "react";

import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { EVENT_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/constants";
import { Event } from "../helpers/types";

export function useEvents() {

    const { setSeverity, setMessage, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery()

    const [events, setEvents] = useState<Event[]>([]);
    const [action, setAction] = useState<null | 'NEW' | 'EDIT' | 'VIEW' | 'DELETE'>(null);

    async function getEvents(): Promise<void> {
        const { status, data } = await handleQuery({ url: EVENT_URL });
        if (status === STATUS_CODES.OK) {
            setEvents(data);
        }
    }

    async function handleSubmit(
        e: { preventDefault: () => void; },
        formData: any,
        validate: () => any,
        reset: () => void,
        setDisabled: (arg0: boolean) => void,
        action: 'NEW' | 'EDIT',
        setAction: (arg0: null) => void
    ) {
        e.preventDefault();
        if (validate()) {
            const urls = { 'NEW': EVENT_URL, 'EDIT': `${EVENT_URL}/${formData.id}` }
            const { status, data } = await handleQuery({
                url: urls[action],
                method: action === 'NEW' ? 'POST' : action === 'EDIT' ? 'PUT' : 'GET',
                body: formData
            })
            if (status === STATUS_CODES.CREATED) {
                setEvents(data)
                setMessage('Evento registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setEvents([data, ...events.filter(e => e.id !== data.id)])
                setMessage('Evento editado correctamente.')
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
                setSeverity('success')
                reset()
                setAction(null)
            }
            setOpenMessage(true)
        }
    }

    async function destroy(
        id: number,
        setAction: (arg0: null) => void,
        reset: () => void,
        setDisabled: (arg0: boolean) => void
    ): Promise<void> {
        const { status, data } = await handleQuery({
            url: `${EVENT_URL}/${id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setEvents(prev => [...prev.filter(e => e.id !== data.id)]);
            setMessage('Evento eliminado correctamente.');
            setSeverity('success');
            setAction(null);
            reset();
        } else {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true);
    }

    return {
        events,
        getEvents,
        action,
        setAction,
        handleSubmit,
        destroy
    };
}
