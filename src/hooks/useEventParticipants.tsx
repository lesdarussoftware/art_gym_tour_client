/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react";

import { MessageContext } from "../providers/MessageProvider";
import { EventParticipantContext } from "../providers/EventParticipantProvider";

import { useQuery } from "./useQuery";

import { NoteGaf, NoteGam } from "../helpers/types";
import { NOTE_GAF__URL, NOTE_GAM_URL, EVENT_PARTICIPANT_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/constants";

export function useEventParticipants() {

    const { setSeverity, setMessage, setOpenMessage } = useContext(MessageContext);
    const { setEventParticipants } = useContext(EventParticipantContext)

    const { handleQuery } = useQuery()

    const [action, setAction] = useState<null | 'NEW' | 'EDIT' | 'DELETE'>(null);

    async function getEventParticipants(event_id: number): Promise<void> {
        const { status, data } = await handleQuery({ url: `${EVENT_PARTICIPANT_URL}?event_id=${event_id}` });
        if (status === STATUS_CODES.OK) {
            setEventParticipants(data);
        }
    }

    async function handleSubmit(
        e: { preventDefault: () => void; },
        formData: any,
        validate: () => any,
        reset: () => void,
        setDisabled: (arg0: boolean) => void,
        setAction: (arg0: null) => void,
        gender: 'M' | 'F'
    ) {
        e.preventDefault();
        if (validate()) {
            const { status, data } = await handleQuery({
                url: EVENT_PARTICIPANT_URL,
                method: 'POST',
                body: {
                    event_id: formData.event_id,
                    participant_id: formData.participant_id,
                    participant_institution_name: formData.participant_institution_name,
                    participant_level: formData.participant_level !== 'MALE' ? formData.participant_level : undefined,
                    category: formData.category
                }
            });
            if (status === STATUS_CODES.CREATED) {
                const newNotes = {
                    event_participant_id: data.id,
                    salto_note: formData.salto_note,
                    salto_ne: formData.salto_ne,
                    salto_nd: formData.salto_nd,
                    paralelas_note: formData.paralelas_note,
                    paralelas_nd: formData.paralelas_nd,
                    paralelas_ne: formData.paralelas_ne,
                    suelo_note: formData.suelo_note,
                    suelo_nd: formData.suelo_nd,
                    suelo_ne: formData.suelo_ne
                }
                const newNotesGaf = {
                    ...newNotes,
                    viga_note: formData.viga_note,
                    viga_nd: formData.viga_nd,
                    viga_ne: formData.viga_ne,
                    penalization: formData.penalization
                }
                const newNotesGam = {
                    ...newNotes,
                    salto_penalization: formData.salto_penalization,
                    paralelas_penalization: formData.paralelas_penalization,
                    suelo_penalization: formData.suelo_penalization,
                    barra_fija_note: formData.barra_fija_note,
                    barra_fija_nd: formData.barra_fija_nd,
                    barra_fija_ne: formData.barra_fija_ne,
                    barra_fija_penalization: formData.barra_fija_penalization,
                    arzones_note: formData.arzones_note,
                    arzones_nd: formData.arzones_nd,
                    arzones_ne: formData.arzones_ne,
                    arzones_penalization: formData.arzones_penalization,
                    anillas_note: formData.anillas_note,
                    anillas_nd: formData.anillas_nd,
                    anillas_ne: formData.anillas_ne,
                    anillas_penalization: formData.anillas_penalization
                }
                if (gender === 'F') {
                    const { status: statusNoteGaf, data: dataNoteGaf } = await handleQuery({
                        url: NOTE_GAF__URL,
                        method: 'POST',
                        body: newNotesGaf
                    })
                    if (statusNoteGaf === STATUS_CODES.CREATED) {
                        setEventParticipants(prev => [
                            ...prev,
                            {
                                ...data,
                                notes_gaf: dataNoteGaf
                            }
                        ]);
                        setMessage('Participante registrado correctamente.');
                        reset();
                        setSeverity('success');
                        setAction(null);
                    } else {
                        setMessage('Ocurrió un error.');
                        setSeverity('error');
                        setDisabled(false);
                    }
                }
                if (gender === 'M') {
                    const { status: statusNoteGam, data: dataNoteGam } = await handleQuery({
                        url: NOTE_GAM_URL,
                        method: 'POST',
                        body: newNotesGam
                    })
                    if (statusNoteGam === STATUS_CODES.CREATED) {
                        setEventParticipants(prev => [
                            ...prev,
                            {
                                ...data,
                                notes_gam: dataNoteGam
                            }
                        ]);
                        setMessage('Participante registrado correctamente.');
                        reset();
                        setSeverity('success');
                        setAction(null);
                    } else {
                        setMessage('Ocurrió un error.');
                        setSeverity('error');
                        setDisabled(false);
                    }
                }
            } else {
                setMessage('Ocurrió un error.');
                setSeverity('error');
                setDisabled(false);
            }
            setOpenMessage(true);
        }
    }

    async function updateNotes(
        e: { preventDefault: () => void; },
        data: NoteGaf | NoteGam,
        gender: 'F' | 'M',
        setAction: (arg0: null) => void
    ) {
        e.preventDefault();
        try {
            if (gender === 'F') await handleQuery({
                url: `${NOTE_GAF__URL}/${data.id}`,
                method: 'PUT',
                body: data
            });
            if (gender === 'M') await handleQuery({
                url: `${NOTE_GAM_URL}/${data.id}`,
                method: 'PUT',
                body: data
            });
            setMessage('Notas actualizadas correctamente.');
            setEventParticipants(prev => [...prev.filter(ep => ep.id !== data.event_participant_id), {
                ...prev.find(ep => ep.id === data.event_participant_id)!,
                notes: data
            }]);
            setSeverity('success');
            setAction(null);
        } catch (e) {
            setSeverity('error');
            if (e instanceof Error) {
                setMessage(`Ocurrió un error: ${e.message}`);
            } else {
                setMessage('Ocurrió un error inesperado.');
            }
        }
        setOpenMessage(true);
    }

    async function destroy(id: number, reset: () => void, setAction: (arg0: null) => void): Promise<void> {
        const { status, data } = await handleQuery({
            url: `${EVENT_PARTICIPANT_URL}/${id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            setEventParticipants(prev => [...prev.filter(ep => ep.id !== data.id)]);
            setMessage('Registro eliminado correctamente.');
            setSeverity('success');
            setAction(null);
            reset();
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true);
    }

    return {
        getEventParticipants,
        action,
        setAction,
        handleSubmit,
        destroy,
        updateNotes
    };
}
