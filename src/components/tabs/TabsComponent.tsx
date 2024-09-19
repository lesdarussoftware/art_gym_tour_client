/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Button, Tabs, Tab, Box, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { useEventParticipants } from '../../hooks/useEventParticipants';
import { useParticipants } from '../../hooks/useParticipants';
import { useForm } from '../../hooks/useForm';

import { DataGrid } from '../datagrid/DataGrid';
import { ModalComponent } from '../ModalComponent';
import { CustomTabPanel } from './CustomTabPanel';
import { AbmEventParticipants } from '../AbmEventParticipants';
import { ScorePresentation } from '../ScorePresentation';

import { a11yProps, getAllowedParticipants } from '../../helpers/utils';
import { EventParticipant } from '../../server/db';

export function TabsComponent({
    level,
    event_id,
    categories,
    headCells,
    gender
}: {
    level: string;
    event_id: number;
    categories: string[];
    headCells: any[];
    gender: 'F' | 'M'
}) {

    const { getParticipants, participants } = useParticipants();
    const { getAll, eventParticipants, action, setAction, handleSubmit, destroy, updateNotes } = useEventParticipants();
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
        paralelas_note: 0,
        suelo_note: 0,
        viga_note: 0,
        barra_fija_note: 0,
        arzones_note: 0,
        anillas_note: 0,
        penalization: 0,
        nd_note: 10,
        ne_note: 0,
    });

    useEffect(() => {
        getParticipants();
        getAll(event_id);
    }, []);

    useEffect(() => {
        if (formData.participant_id.toString().length > 0) {
            setFormData({
                ...formData,
                participant_institution_name: participants.find(p => p.id === formData.participant_id)?.institution_name
            })
        }
    }, [formData.participant_id])

    useEffect(() => {
        if (action === 'EDIT') setNotes(formData.notes);
    }, [action])

    const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => setValue(newValue);

    const handleClose = () => {
        setAction(null);
        reset();
        if (confirmDelete) setConfirmDelete(false);
    }

    const NE_LEVELS = ['NIVEL 6', 'NIVEL 7', 'NIVEL 8', 'NIVEL 9'];

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
                    {categories.map((cat, idx) => <Tab key={idx} label={cat} {...a11yProps(idx)} />)}
                </Tabs>
            </Box>
            {categories.map((cat, idx) => {
                const allowed = getAllowedParticipants(participants, gender, level, cat);
                const allowedIds = allowed.map(a => a.id)
                return (
                    <CustomTabPanel key={idx} value={value} index={idx}>
                        <DataGrid
                            headCells={gender === 'M' && NE_LEVELS.includes(level) ?
                                [
                                    ...headCells,
                                    {
                                        id: 'nd_note',
                                        numeric: false,
                                        disablePadding: true,
                                        label: 'ND',
                                        sorter: (row: EventParticipant & { notes: { nd_note: string } }) => parseInt(row.notes.nd_note),
                                        accessor: (row: EventParticipant & { notes: { nd_note: string } }) => parseInt(row.notes.nd_note)
                                    },
                                    {
                                        id: 'ne_note',
                                        numeric: false,
                                        disablePadding: true,
                                        label: 'NE',
                                        sorter: (row: EventParticipant & { notes: { ne_note: string } }) => parseInt(row.notes.ne_note),
                                        accessor: (row: EventParticipant & { notes: { ne_note: string } }) => parseInt(row.notes.ne_note)
                                    },
                                    {
                                        id: 'nf_note',
                                        numeric: false,
                                        disablePadding: true,
                                        label: 'NF',
                                        sorter: (row: EventParticipant &
                                        {
                                            notes: {
                                                nd_note: string;
                                                ne_note: string;
                                            }
                                        }) => {
                                            const result = parseInt(row.notes.nd_note) - parseInt(row.notes.ne_note);
                                            return isNaN(result) ? 0 : result;
                                        },
                                        accessor: (row: EventParticipant &
                                        {
                                            notes: {
                                                nd_note: string;
                                                ne_note: string;
                                            }
                                        }) => {
                                            const result = parseInt(row.notes.nd_note) - parseInt(row.notes.ne_note);
                                            return isNaN(result) ? 0 : result;
                                        }
                                    },
                                ] : headCells
                            }
                            rows={eventParticipants.filter(ep => {
                                return ep.category === cat &&
                                    ep.participant_level === level &&
                                    ep.participant_id &&
                                    allowedIds.includes(ep.participant_id)
                            })}
                            setAction={setAction}
                            setData={setFormData}
                            defaultOrderBy='total'
                            showPlayAction={() => setShowScore(true)}
                            showEditAction
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
