/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react";
import { format } from "date-fns";

import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { getParticipantAge, getParticipantCategory } from "../helpers/utils";
import { PARTICIPANT_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/constants";
import { Participant } from "../helpers/types";

export function useParticipants() {

    const { setSeverity, setMessage, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery()

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [action, setAction] = useState<null | 'NEW' | 'EDIT' | 'DELETE'>(null);

    async function getParticipants(): Promise<void> {
        const { status, data } = await handleQuery({ url: PARTICIPANT_URL });
        if (status === STATUS_CODES.OK) {
            setParticipants(data);
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
            const urls = { 'NEW': PARTICIPANT_URL, 'EDIT': `${PARTICIPANT_URL}/${formData.id}` }
            const { status, data } = await handleQuery({
                url: urls[action],
                method: action === 'NEW' ? 'POST' : action === 'EDIT' ? 'PUT' : 'GET',
                body: formData
            })
            if (status === STATUS_CODES.CREATED) {
                setParticipants(data)
                setMessage('Participante registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setParticipants([data, ...participants.filter(p => p.id !== data.id)])
                setMessage('Participante editado correctamente.')
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
            url: `${PARTICIPANT_URL}/${id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setParticipants(prev => [...prev.filter(p => p.id !== data.id)]);
            setMessage('Participante eliminado correctamente.');
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

    const headCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: '#',
            sorter: (row: Participant) => row.id,
            accessor: 'id'
        },
        {
            id: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            sorter: (row: Participant) => row.first_name,
            accessor: 'first_name'
        },
        {
            id: 'last_name',
            numeric: false,
            disablePadding: true,
            label: 'Apellido',
            sorter: (row: Participant) => row.last_name,
            accessor: 'last_name'
        },
        {
            id: 'dni',
            numeric: false,
            disablePadding: true,
            label: 'DNI',
            sorter: (row: Participant) => row.dni,
            accessor: 'dni'
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            sorter: (row: Participant) => row.phone,
            accessor: 'phone'
        },
        {
            id: 'birth',
            numeric: false,
            disablePadding: true,
            label: 'F. Nac.',
            sorter: (row: Participant) => format(new Date(row.birth), 'dd/MM/yyyy'),
            accessor: (row: Participant) => format(new Date(row.birth), 'dd/MM/yyyy')
        },
        {
            id: 'age',
            numeric: false,
            disablePadding: true,
            label: 'Edad',
            sorter: (row: Participant) => getParticipantAge(row.birth.toISOString().split('T')[0]),
            accessor: (row: Participant) => getParticipantAge(row.birth.toISOString().split('T')[0])
        },
        {
            id: 'gender',
            numeric: false,
            disablePadding: true,
            label: 'Género',
            sorter: (row: Participant) => row.gender,
            accessor: 'gender'
        },
        {
            id: 'level',
            numeric: false,
            disablePadding: true,
            label: 'Nivel',
            sorter: (row: Participant) => row.level,
            accessor: 'level'
        },
        {
            id: 'institution_name',
            numeric: false,
            disablePadding: true,
            label: 'Gym / Esc.',
            sorter: (row: Participant) => row.institution,
            accessor: 'institution_name'
        },
        {
            id: 'category',
            numeric: false,
            disablePadding: true,
            label: 'Categoría actual',
            sorter: (row: Participant) => getParticipantCategory(row.birth, row.gender),
            accessor: (row: Participant) => getParticipantCategory(row.birth, row.gender)
        }
    ]

    return {
        participants,
        getParticipants,
        action,
        setAction,
        handleSubmit,
        destroy,
        headCells
    };
}
