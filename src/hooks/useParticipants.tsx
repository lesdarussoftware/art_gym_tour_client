/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react";
import { format } from "date-fns";

import { MessageContext } from "../providers/MessageProvider";

import { Participant } from "../server/db";
import { ParticipantService } from "../server/participants";
import { getParticipantAge, getParticipantCategory } from "../helpers/utils";

export function useParticipants() {

    const { setSeverity, setMessage, setOpenMessage } = useContext(MessageContext);

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [action, setAction] = useState<null | 'NEW' | 'EDIT' | 'DELETE'>(null);

    async function getParticipants(): Promise<void> {
        const data = await ParticipantService.findAll();
        setParticipants(data);
    }

    async function handleSubmit(
        e: { preventDefault: () => void; },
        formData: any,
        validate: () => any,
        reset: () => void,
        setDisabled: (arg0: boolean) => void,
        action: null | 'NEW' | 'EDIT' | 'DELETE',
        setAction: (arg0: null) => void
    ) {
        e.preventDefault();
        if (!validate()) return;
        try {
            if (action === 'NEW') {
                const id: number = await ParticipantService.create({ ...formData, id: undefined });
                setParticipants(prevParticipants => [...prevParticipants, { id, ...formData }]);
                setMessage('Participante registrado correctamente.');
            }
            if (action === 'EDIT') {
                await ParticipantService.update(formData);
                const id: number = formData.id!;
                setParticipants(prevParticipants => [...prevParticipants.filter(p => p.id !== id), formData]);
                setMessage('Participante editado correctamente.');
            }
            reset();
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
        setDisabled(false);
        setOpenMessage(true);
    }

    async function destroy(id: number, reset: () => void, setAction: (arg0: null) => void): Promise<void> {
        try {
            await ParticipantService.destroy(id);
            setParticipants(prev => [...prev.filter(p => p.id !== id)]);
            setMessage('Participante eliminado correctamente.');
            setSeverity('success');
            setAction(null);
            reset();
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
            sorter: (row: Participant) => row.institution_name,
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
