/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Box, FormControl, InputLabel, Select, MenuItem, Typography, TextField } from '@mui/material';

import { NoteGaf, NoteGam, Participant } from '../server/db';
import { getAllowedParticipants, getTotalGaf, getTotalGam } from '../helpers/utils';

interface AbmEventParticipantsProps {
    handleChange: any;
    handleSubmit: any;
    formData: any;
    validate: () => boolean;
    reset: () => void;
    setDisabled: (disabled: boolean) => void;
    action: any;
    setAction: any;
    participants: Participant[];
    errors: FormErrors;
    disabled: boolean;
    handleClose: () => void;
    gender: 'F' | 'M';
    updateNotes: (e: any, data: NoteGaf | NoteGam, gender: 'F' | 'M', setAction: any) => void;
    level: string;
    category: string;
    notes: any;
    setNotes: (notes: any) => void;
}

interface FormErrors {
    participant_id?: {
        type: string;
    };
}

export function AbmEventParticipants({
    handleChange,
    handleSubmit,
    formData,
    validate,
    reset,
    setDisabled,
    action,
    setAction,
    participants,
    errors,
    disabled,
    handleClose,
    gender,
    updateNotes,
    level,
    category,
    notes,
    setNotes
}: AbmEventParticipantsProps) {

    const handleChangeNote = (e: any) => {
        setNotes({
            ...notes,
            [e.target.name]: e.target.value
        })
    }

    return (
        <form
            onChange={handleChange}
            onSubmit={e => {
                if (action === 'NEW') handleSubmit(e, { ...formData, ...notes }, validate, reset, setDisabled, setAction, gender)
                if (action === 'EDIT') {
                    const newNotes = {
                        id: notes.id,
                        event_participant_id: notes.event_participant_id,
                        salto_note: notes.salto_note,
                        paralelas_note: notes.paralelas_note,
                        suelo_note: notes.suelo_note,
                        penalization: notes.penalization
                    }
                    const newNotesGaf = { ...newNotes, viga_note: notes.viga_note }
                    const newNotesGam = {
                        ...newNotes,
                        barra_fija_note: notes.barra_fija_note,
                        arzones_note: notes.arzones_note,
                        anillas_note: notes.anillas_note,
                        nd_note: notes.nd_note,
                        ne_note: notes.ne_note
                    }
                    const data = gender === 'F' ? newNotesGaf : newNotesGam;
                    updateNotes(e, data, gender, setAction)
                }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
                <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="participant-select">Participante</InputLabel>
                    <Select
                        labelId="participant-select"
                        id="participant_id"
                        value={formData.participant_id}
                        label="Participante"
                        name="participant_id"
                        sx={{ width: '100%' }}
                        onChange={handleChange}
                        disabled={action === 'EDIT'}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        {getAllowedParticipants(participants, gender, level, category).map((p: Participant) => (
                            <MenuItem key={p.id} value={p.id}>{`${p.first_name} ${p.last_name}`}</MenuItem>
                        ))}
                    </Select>
                    {errors.participant_id?.type === 'required' &&
                        <Typography variant="caption" color="red" marginTop={1}>
                            * El participante es requerido.
                        </Typography>
                    }
                </FormControl>
                {action === 'EDIT' &&
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControl>
                            <TextField
                                label="Nota Salto"
                                type="number"
                                name='salto_note'
                                value={notes.salto_note}
                                onChange={handleChangeNote}
                                inputProps={{ step: 0.001, min: 0 }}
                                variant="outlined"
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Nota Paralelas"
                                type="number"
                                name='paralelas_note'
                                value={notes.paralelas_note}
                                onChange={handleChangeNote}
                                inputProps={{ step: 0.001, min: 0 }}
                                variant="outlined"
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Nota Suelo"
                                type="number"
                                name='suelo_note'
                                value={notes.suelo_note}
                                onChange={handleChangeNote}
                                inputProps={{ step: 0.001, min: 0 }}
                                variant="outlined"
                            />
                        </FormControl>
                        {gender === 'F' &&
                            <>
                                <FormControl>
                                    <TextField
                                        label="Nota Viga"
                                        type="number"
                                        name='viga_note'
                                        value={notes.viga_note}
                                        onChange={handleChangeNote}
                                        inputProps={{ step: 0.001, min: 0 }}
                                        variant="outlined"
                                    />
                                </FormControl>
                                <FormControl>
                                    <TextField
                                        label="Penalización"
                                        type="number"
                                        name='penalization'
                                        value={notes.penalization}
                                        onChange={handleChangeNote}
                                        inputProps={{ step: 0.001, min: 0 }}
                                        variant="outlined"
                                    />
                                </FormControl>
                                <FormControl>
                                    <TextField
                                        label="Total"
                                        type="number"
                                        value={getTotalGaf(notes)}
                                        variant="outlined"
                                        disabled
                                    />
                                </FormControl>
                            </>
                        }
                        {gender === 'M' &&
                            <>
                                <FormControl>
                                    <TextField
                                        label="Nota Barra Fija"
                                        type="number"
                                        name='barra_fija_note'
                                        value={notes.barra_fija_note}
                                        onChange={handleChangeNote}
                                        inputProps={{ step: 0.001, min: 0 }}
                                        variant="outlined"
                                    />
                                </FormControl>
                                <FormControl>
                                    <TextField
                                        label="Nota Arzones"
                                        type="number"
                                        name='arzones_note'
                                        value={notes.arzones_note}
                                        onChange={handleChangeNote}
                                        inputProps={{ step: 0.001, min: 0 }}
                                        variant="outlined"
                                    />
                                </FormControl>
                                <FormControl>
                                    <TextField
                                        label="Nota Anillas"
                                        type="number"
                                        name='anillas_note'
                                        value={notes.anillas_note}
                                        onChange={handleChangeNote}
                                        inputProps={{ step: 0.001, min: 0 }}
                                        variant="outlined"
                                    />
                                </FormControl>
                                <FormControl>
                                    <TextField
                                        label="Penalización"
                                        type="number"
                                        name='penalization'
                                        value={notes.penalization}
                                        onChange={handleChangeNote}
                                        inputProps={{ step: 0.001, min: 0 }}
                                        variant="outlined"
                                    />
                                </FormControl>
                                <FormControl>
                                    <TextField
                                        label="ND"
                                        type="number"
                                        name='nd_note'
                                        value={notes.nd_note}
                                        onChange={handleChangeNote}
                                        inputProps={{ step: 0.001, min: 10 }}
                                        variant="outlined"
                                    />
                                </FormControl>
                                <FormControl>
                                    <TextField
                                        label="NE"
                                        type="number"
                                        name='ne_note'
                                        value={notes.ne_note}
                                        onChange={handleChangeNote}
                                        inputProps={{ step: 0.001, min: 0 }}
                                        variant="outlined"
                                    />
                                </FormControl>
                                <FormControl>
                                    <TextField
                                        label="Total"
                                        type="number"
                                        value={getTotalGam(notes)}
                                        variant="outlined"
                                        disabled
                                    />
                                </FormControl>
                            </>
                        }
                    </Box>
                }
                <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}>
                    <Button
                        type="button"
                        variant="outlined"
                        sx={{ px: 2 }}
                        disabled={disabled}
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ color: '#fff', px: 2 }}
                        disabled={disabled}
                    >
                        Guardar
                    </Button>
                </Box>
            </Box>
        </form>
    );
}
