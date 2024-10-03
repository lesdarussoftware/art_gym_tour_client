/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Tabs, Tab, Box, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';

import { EventParticipantContext } from '../../providers/EventParticipantProvider';
import { useEventParticipants } from '../../hooks/useEventParticipants';
import { useForm } from '../../hooks/useForm';

import { DataGrid } from '../datagrid/DataGrid';
import { ModalComponent } from '../ModalComponent';
import { CustomTabPanel } from './CustomTabPanel';
import { AbmEventParticipants } from '../AbmEventParticipants';
import { ScorePresentation } from '../ScorePresentation';

import { a11yProps, getAllowedParticipants } from '../../helpers/utils';
import { EventParticipant, Participant } from '../../helpers/types';

export function TabsComponent({
    level,
    event_id,
    categories,
    gender,
    participants
}: {
    level: string;
    event_id: number;
    categories: string[];
    gender: 'F' | 'M';
    participants: Participant[]
}) {

    const { eventParticipants } = useContext(EventParticipantContext)

    const { action, setAction, handleSubmit, destroy, updateNotes } = useEventParticipants();
    const { formData, handleChange, setFormData, errors, disabled, validate, reset, setDisabled } = useForm({
        defaultData: {
            id: '',
            participant: '',
            event_id,
            participant_id: '',
            participant_institution_name: '',
            participant_level: level,
            category: '',
            notes: []
        },
        rules: {
            participant_id: { required: true }
        }
    });

    const [value, setValue] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showScore, setShowScore] = useState(false);
    const [notes, setNotes] = useState({
        salto_note: 0,
        salto_nd: 0,
        salto_ne: 0,
        salto_penalization: 0,
        paralelas_note: 0,
        paralelas_nd: 0,
        paralelas_ne: 0,
        paralelas_penalization: 0,
        barra_fija_note: 0,
        barra_fija_nd: 0,
        barra_fija_ne: 0,
        barra_fija_penalization: 0,
        suelo_note: 0,
        suelo_nd: 0,
        suelo_ne: 0,
        suelo_penalization: 0,
        arzones_note: 0,
        arzones_nd: 0,
        arzones_ne: 0,
        arzones_penalization: 0,
        anillas_note: 0,
        anillas_nd: 0,
        anillas_ne: 0,
        anillas_penalization: 0,
        viga_note: 0,
        viga_nd: 0,
        viga_ne: 0,
        penalization: 0
    });

    useEffect(() => {
        if (formData.participant_id.toString().length > 0) {
            setFormData({
                ...formData,
                participant_institution_name: participants.find(p => p.id === formData.participant_id)?.institution
            })
        }
    }, [formData.participant_id])

    useEffect(() => {
        if (action === 'EDIT') setNotes(formData.notes);
    }, [action])

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
            id: 'participant',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            sorter: (row: EventParticipant & { participant: Participant }) => row.participant.first_name,
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
        {
            id: 'salto',
            numeric: false,
            disablePadding: true,
            label: 'Salto',
            sorter: (row: EventParticipant & { participant: Participant }) => row.participant.first_name,
            accessor: (row: EventParticipant) => (
                <Button type="button" variant="contained" size="small" onClick={() => {
                    setFormData(row)
                    setAction('EDIT')
                }}>
                    <EditIcon sx={{ color: '#FFF' }} />
                </Button>
            )
        },
        {
            id: 'paralelas',
            numeric: false,
            disablePadding: true,
            label: 'Paralelas',
            sorter: (row: EventParticipant & { participant: Participant }) => row.participant.first_name,
            accessor: (row: EventParticipant) => (
                <Button type="button" variant="contained" size="small" onClick={() => {
                    setFormData(row)
                    setAction('EDIT')
                }}>
                    <EditIcon sx={{ color: '#FFF' }} />
                </Button>
            )
        },
        {
            id: 'suelo',
            numeric: false,
            disablePadding: true,
            label: 'Suelo',
            sorter: (row: EventParticipant & { participant: Participant }) => row.participant.first_name,
            accessor: (row: EventParticipant) => (
                <Button type="button" variant="contained" size="small" onClick={() => {
                    setFormData(row)
                    setAction('EDIT')
                }}>
                    <EditIcon sx={{ color: '#FFF' }} />
                </Button>
            )
        }
    ]

    const headCellsGaf = useMemo(() => [
        ...headCells,
        {
            id: 'viga',
            numeric: false,
            disablePadding: true,
            label: 'Viga',
            sorter: (row: EventParticipant & { participant: Participant }) => row.participant.first_name,
            accessor: (row: EventParticipant) => (
                <Button type="button" variant="contained" size="small" onClick={() => {
                    setFormData(row)
                    setAction('EDIT')
                }}>
                    <EditIcon sx={{ color: '#FFF' }} />
                </Button>
            )
        },
        {
            id: 'penalization',
            numeric: false,
            disablePadding: true,
            label: 'Penalización',
            sorter: (row: EventParticipant & { notes: { penalization: string } }) => row.notes.penalization,
            accessor: (row: EventParticipant & { notes: { penalization: string } }) => row.notes.penalization
        }
    ], []);

    const headCellsGam = useMemo(() => [
        ...headCells,
        {
            id: 'barra_fija',
            numeric: false,
            disablePadding: true,
            label: 'Barra Fija',
            sorter: (row: EventParticipant & { participant: Participant }) => row.participant.first_name,
            accessor: (row: EventParticipant) => (
                <Button type="button" variant="contained" size="small" onClick={() => {
                    setFormData(row)
                    setAction('EDIT')
                }}>
                    <EditIcon sx={{ color: '#FFF' }} />
                </Button>
            )
        },
        {
            id: 'arzones',
            numeric: false,
            disablePadding: true,
            label: 'Arzones',
            sorter: (row: EventParticipant & { participant: Participant }) => row.participant.first_name,
            accessor: (row: EventParticipant) => (
                <Button type="button" variant="contained" size="small" onClick={() => {
                    setFormData(row)
                    setAction('EDIT')
                }}>
                    <EditIcon sx={{ color: '#FFF' }} />
                </Button>
            )
        },
        {
            id: 'anillas',
            numeric: false,
            disablePadding: true,
            label: 'Anillas',
            sorter: (row: EventParticipant & { participant: Participant }) => row.participant.first_name,
            accessor: (row: EventParticipant) => (
                <Button type="button" variant="contained" size="small" onClick={() => {
                    setFormData(row)
                    setAction('EDIT')
                }}>
                    <EditIcon sx={{ color: '#FFF' }} />
                </Button>
            )
        }
    ], []);

    const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => setValue(newValue);

    const handleClose = () => {
        setAction(null);
        reset();
        if (confirmDelete) setConfirmDelete(false);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
                    {categories.map((cat, idx) => <Tab key={idx} label={cat} {...a11yProps(idx)} />)}
                </Tabs>
            </Box>
            {categories.map((cat, idx) => {
                const allowedParticipants = getAllowedParticipants(participants, gender, level, cat);
                const allowedIds = allowedParticipants.map((a: { id: any; }) => a.id)
                return (
                    <CustomTabPanel key={idx} value={value} index={idx}>
                        <DataGrid
                            headCells={gender === 'F' ? headCellsGaf : headCellsGam}
                            rows={eventParticipants.filter(ep => allowedIds.includes(ep.participant_id))}
                            setAction={setAction}
                            setData={setFormData}
                            defaultOrderBy='total'
                            showPlayAction={() => setShowScore(true)}
                            showDeleteAction
                            contentHeader={
                                <Box sx={{ display: 'flex', justifyContent: 'end', p: 1, pb: 0 }}>
                                    <Button
                                        variant='contained'
                                        size="small"
                                        sx={{ color: '#FFF' }}
                                        disabled={participants.length === 0}
                                        onClick={() => {
                                            setFormData({ ...formData, category: cat })
                                            setAction('NEW')
                                        }}
                                    >
                                        <AddCircleIcon />
                                    </Button>
                                </Box>
                            }
                        />
                    </CustomTabPanel>
                )
            })}
            <ModalComponent open={action === 'NEW' || action === 'EDIT'} onClose={handleClose}>
                <Typography variant='h6' mb={1}>
                    {action === 'NEW' && 'Nuevo registro'}
                    {action === 'EDIT' && `Editar registro #${formData.id}`}
                </Typography>
                <Typography variant='body1' mb={1}>
                    {formData.level}
                </Typography>
                <Typography variant='body1' mb={1}>
                    {formData.category}
                </Typography>
                <AbmEventParticipants
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    formData={formData}
                    validate={validate}
                    reset={reset}
                    setDisabled={setDisabled}
                    action={action}
                    setAction={setAction}
                    participants={participants}
                    errors={errors}
                    disabled={disabled}
                    handleClose={handleClose}
                    gender={gender}
                    updateNotes={updateNotes}
                    level={level}
                    category={formData.category}
                    notes={notes}
                    setNotes={setNotes}
                />
            </ModalComponent>
            <ModalComponent open={action === 'DELETE'} onClose={handleClose}>
                <Typography variant='h6' align='center' mb={3}>
                    {`¿Eliminar el registro de ${formData.participant.first_name} ${formData.participant.last_name}
                     (${formData.participant.dni}) del nivel ${formData.level} y la categoría ${formData.category}?`}
                </Typography>
                <Typography variant='body1' align='center' mb={3}>
                    Los datos no podrán ser recuperados.
                </Typography>
                {confirmDelete &&
                    <Typography variant='body1' align='right' sx={{ color: '#F00', marginBottom: 2 }}>
                        Confirme eliminación de datos
                    </Typography>
                }
                <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}>
                    <Button
                        type="button"
                        variant="contained"
                        sx={{ color: '#fff', px: 2 }}
                        onClick={async () => {
                            if (confirmDelete) {
                                await destroy(formData.id, reset, setAction)
                                setConfirmDelete(false)
                            } else {
                                setConfirmDelete(true)
                            }
                        }}
                    >
                        Eliminar
                    </Button>
                    <Button
                        type="button"
                        variant="outlined"
                        sx={{ px: 2 }}
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                </Box>
            </ModalComponent>
            {showScore &&
                <ScorePresentation
                    formData={formData}
                    gender={gender}
                    onClose={() => {
                        setShowScore(false)
                        reset()
                    }}
                />
            }
        </Box>
    );
}
