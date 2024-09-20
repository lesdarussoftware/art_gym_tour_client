/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../providers/MessageProvider";

import { useQuery } from "./useQuery";

import { Participant, EventParticipant, NoteGaf, NoteGam } from "../helpers/types";
import { getTotalGaf, getTotalGam } from "../helpers/utils";
import { PARTICIPANT_URL, NOTE_GAF__URL, NOTE_GAM_URL, EVENT_PARTICIPANT_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/constants";

export function useEventParticipants() {

    const { setSeverity, setMessage, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery()

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [eventParticipants, setEventParticipants] = useState<EventParticipant[]>([]);
    const [action, setAction] = useState<null | 'NEW' | 'EDIT' | 'DELETE'>(null);

    async function getAll(event_id: number): Promise<void> {
        const { data: dataParticipants } = await handleQuery({ url: PARTICIPANT_URL });
        setParticipants(dataParticipants);
        const { data: notesGaf } = await handleQuery({ url: NOTE_GAF__URL });
        const { data: notesGam } = await handleQuery({ url: NOTE_GAM_URL });
        const { status, data } = await handleQuery({ url: `${EVENT_PARTICIPANT_URL}?event_id=${event_id}` });
        if (status === STATUS_CODES.OK) {
            setEventParticipants(data.map((ep: EventParticipant) => {
                const participant = dataParticipants.find((p: Participant) => p.id === ep.participant_id)!;
                let notes;
                if (participant.gender === 'F') {
                    notes = notesGaf.find((n: NoteGaf) => n.event_participant_id === ep.id);
                }
                if (participant.gender === 'M') {
                    notes = notesGam.find((n: NoteGam) => n.event_participant_id === ep.id);
                }
                return { ...ep, participant, notes };
            }));
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
        if (!validate()) return;
        try {
            const { status, data } = await handleQuery({
                url: EVENT_PARTICIPANT_URL,
                method: 'POST',
                body: {
                    event_id: formData.event_id,
                    participant_id: formData.participant_id,
                    participant_institution_name: formData.participant_institution_name,
                    participant_level: formData.participant_level,
                    category: formData.category
                }
            });
            if (status === STATUS_CODES.CREATED) {
                const newNotes = {
                    event_participant_id: data.id,
                    salto_note: formData.salto_note,
                    paralelas_note: formData.paralelas_note,
                    suelo_note: formData.suelo_note,
                    penalization: formData.penalization
                }
                const newNotesGaf = { ...newNotes, viga_note: formData.viga_note }
                const newNotesGam = {
                    ...newNotes,
                    barra_fija_note: formData.barra_fija_note,
                    arzones_note: formData.arzones_note,
                    anillas_note: formData.anillas_note,
                    nd_note: formData.nd_note,
                    ne_note: formData.ne_note
                }
                if (gender === 'F') await handleQuery({
                    url: NOTE_GAF__URL,
                    method: 'POST',
                    body: newNotesGaf
                })
                if (gender === 'M') await handleQuery({
                    url: NOTE_GAM_URL,
                    method: 'POST',
                    body: newNotesGam
                })
                setEventParticipants(prev => [...prev, {
                    ...data,
                    participant: participants.find(p => p.id === formData.participant_id)!,
                    notes: gender === 'M' ? newNotesGam : newNotesGaf
                }]);
                setMessage('Participante registrado correctamente.');
                reset();
                setSeverity('success');
                setAction(null);
            }
        } catch (e) {
            setSeverity('error');
            if (e instanceof Error) {
                setMessage(`Ocurrió un error: ${e.message}`);
            } else {
                setMessage('Ocurrió un error inesperado.');
            }
        }
        setDisabled(false);
        setOpenMessage(true);
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

    const headCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: '#',
            sorter: (row: EventParticipant) => row.id,
            accessor: 'id'
        },
        {
            id: 'participant_id',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            sorter: (row: EventParticipant & { participant: Participant }) => `${row.participant.first_name} ${row.participant.last_name}`,
            accessor: (row: EventParticipant & { participant: Participant }) => `${row.participant.first_name} ${row.participant.last_name}`
        },
        {
            id: 'participant_institution_name',
            numeric: false,
            disablePadding: true,
            label: 'Gym / Esc.',
            sorter: (row: EventParticipant) => row.participant_institution_name,
            accessor: 'participant_institution_name'
        },
    ]

    const headCellsGaf = useMemo(() => [
        ...headCells,
        {
            id: 'salto_note',
            numeric: false,
            disablePadding: true,
            label: 'Salto',
            sorter: (row: EventParticipant & { notes: { salto_note: string } }) => row.notes.salto_note,
            accessor: (row: EventParticipant & { notes: { salto_note: string } }) => row.notes.salto_note
        },
        {
            id: 'paralelas_note',
            numeric: false,
            disablePadding: true,
            label: 'Paral.',
            sorter: (row: EventParticipant & { notes: { paralelas_note: string } }) => row.notes.paralelas_note,
            accessor: (row: EventParticipant & { notes: { paralelas_note: string } }) => row.notes.paralelas_note
        },
        {
            id: 'viga_note',
            numeric: false,
            disablePadding: true,
            label: 'Viga',
            sorter: (row: EventParticipant & { notes: { viga_note: string } }) => row.notes.viga_note,
            accessor: (row: EventParticipant & { notes: { viga_note: string } }) => row.notes.viga_note
        },
        {
            id: 'suelo_note',
            numeric: false,
            disablePadding: true,
            label: 'Suelo',
            sorter: (row: EventParticipant & { notes: { suelo_note: string } }) => row.notes.suelo_note,
            accessor: (row: EventParticipant & { notes: { suelo_note: string } }) => row.notes.suelo_note
        },
        {
            id: 'penalization',
            numeric: false,
            disablePadding: true,
            label: 'Penal.',
            sorter: (row: EventParticipant & { notes: { penalization: string } }) => row.notes.penalization,
            accessor: (row: EventParticipant & { notes: { penalization: string } }) => row.notes.penalization
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            sorter: (row: EventParticipant) => row.id,
            accessor: (row: EventParticipant & {
                notes: {
                    suelo_note: string;
                    salto_note: string;
                    viga_note: string;
                    paralelas_note: string;
                    penalization: string;
                }
            }) => getTotalGaf(row.notes)
        }
    ], []);

    const headCellsGam = useMemo(() => [
        ...headCells,
        {
            id: 'salto_note',
            numeric: false,
            disablePadding: true,
            label: 'Salto',
            sorter: (row: EventParticipant & { notes: { salto_note: string } }) => row.notes.salto_note,
            accessor: (row: EventParticipant & { notes: { salto_note: string } }) => row.notes.salto_note
        },
        {
            id: 'paralelas_note',
            numeric: false,
            disablePadding: true,
            label: 'Paral.',
            sorter: (row: EventParticipant & { notes: { paralelas_note: string } }) => row.notes.paralelas_note,
            accessor: (row: EventParticipant & { notes: { paralelas_note: string } }) => row.notes.paralelas_note
        },
        {
            id: 'barra_fija_note',
            numeric: false,
            disablePadding: true,
            label: 'B. fija',
            sorter: (row: EventParticipant & { notes: { barra_fija_note: string } }) => row.notes.barra_fija_note,
            accessor: (row: EventParticipant & { notes: { barra_fija_note: string } }) => row.notes.barra_fija_note
        },
        {
            id: 'suelo_note',
            numeric: false,
            disablePadding: true,
            label: 'Suelo',
            sorter: (row: EventParticipant & { notes: { suelo_note: string } }) => row.notes.suelo_note,
            accessor: (row: EventParticipant & { notes: { suelo_note: string } }) => row.notes.suelo_note
        },
        {
            id: 'arzones_note',
            numeric: false,
            disablePadding: true,
            label: 'Arzones',
            sorter: (row: EventParticipant & { notes: { arzones_note: string } }) => row.notes.arzones_note,
            accessor: (row: EventParticipant & { notes: { arzones_note: string } }) => row.notes.arzones_note
        },
        {
            id: 'anillas_note',
            numeric: false,
            disablePadding: true,
            label: 'Anillas',
            sorter: (row: EventParticipant & { notes: { anillas_note: string } }) => row.notes.anillas_note,
            accessor: (row: EventParticipant & { notes: { anillas_note: string } }) => row.notes.anillas_note
        },
        {
            id: 'penalization',
            numeric: false,
            disablePadding: true,
            label: 'Penal.',
            sorter: (row: EventParticipant & { notes: { penalization: string } }) => row.notes.penalization,
            accessor: (row: EventParticipant & { notes: { penalization: string } }) => row.notes.penalization
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            sorter: (row: EventParticipant) => row.id,
            accessor: (row: EventParticipant & {
                notes: {
                    suelo_note: string;
                    salto_note: string;
                    barra_fija_note: string;
                    paralelas_note: string;
                    arzones_note: string;
                    anillas_note: string;
                    penalization: string;
                }
            }) => getTotalGam(row.notes)
        }
    ], []);

    return {
        eventParticipants,
        getAll,
        action,
        setAction,
        headCellsGaf,
        headCellsGam,
        handleSubmit,
        destroy,
        updateNotes
    };
}
