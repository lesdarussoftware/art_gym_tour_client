/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"
import SaveIcon from '@mui/icons-material/Save';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { useEvents } from "../../hooks/useEvents";

type Props = {
    eventFormData: any;
    action: any;
    setAction: any;
}

export function AbmEvents({ eventFormData, action, setAction }: Props) {

    const { handleSubmit } = useEvents();
    const { handleChange, formData, setFormData, errors, disabled, reset, validate, setDisabled } = eventFormData;

    return (
        <Box sx={{ width: { xs: '100%', sm: '70%', maxWidth: '1000px' }, display: 'block', margin: 'auto', mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                    {action === 'NEW' && 'Nuevo evento'}
                    {action === 'EDIT' && `Editar evento #${formData.id}`}
                </Typography>
                <Button variant="outlined" onClick={() => {
                    reset();
                    setAction(null);
                }}>
                    <KeyboardBackspaceIcon />
                </Button>
            </Box>
            <form onChange={handleChange} onSubmit={(e) => handleSubmit(
                e,
                formData,
                validate,
                reset,
                setDisabled,
                action,
                setAction
            )}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <FormControl sx={{ width: '50%' }}>
                            <InputLabel htmlFor="name">Nombre</InputLabel>
                            <Input id="name" type="text" name="name" value={formData.name} />
                            {errors.name?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El nombre es requerido.
                                </Typography>
                            }
                            {errors.name?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El nombre es demasiado largo.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl sx={{ width: '50%' }}>
                            <InputLabel htmlFor="location">Lugar</InputLabel>
                            <Input id="location" type="text" name="location" value={formData.location} />
                            {errors.location?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El lugar es demasiado largo.
                                </Typography>
                            }
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                        <FormControl sx={{ width: '50%' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Fecha"
                                    value={new Date(formData.date)}
                                    onChange={value => handleChange({
                                        target: {
                                            name: 'date',
                                            value: new Date(value?.toISOString() ?? Date.now()),
                                        }
                                    })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        {action === 'EDIT' &&
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Activo"
                                checked={formData.is_active}
                                onChange={(e: any) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                        }
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <InputLabel htmlFor="description">Descripción</InputLabel>
                        <textarea
                            style={{
                                width: '100%',
                                height: 100,
                                border: '1px solid #C4C4C4',
                                padding: 10,
                                borderRadius: 5,
                                resize: 'none'
                            }}
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                        {errors.description?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La descripción es requerida.
                            </Typography>
                        }
                        {errors.description?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La descripción es demasiado larga.
                            </Typography>
                        }
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ color: '#fff', px: 2 }}
                            disabled={disabled}
                        >
                            <SaveIcon sx={{ transform: 'scale(1.3)' }} />
                        </Button>
                    </Box>
                </Box>
            </form>
        </Box>
    )
}