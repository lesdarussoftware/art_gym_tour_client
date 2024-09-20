/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { LEVELS } from "../helpers/constants";

type Props = {
    participantFormData: any;
    action: "NEW" | "EDIT" | "DELETE" | null;
    setAction: any
    handleSubmit: any
}

export function AbmParticipants({ participantFormData, action, setAction, handleSubmit }: Props) {

    const {
        handleChange,
        formData,
        setFormData,
        errors,
        disabled,
        reset,
        validate,
        setDisabled
    } = participantFormData;

    useEffect(() => {
        if (formData.gender === 'M') {
            setFormData({
                ...formData,
                level: ''
            })
        }
    }, [formData.gender])

    return (
        <Box sx={{ width: { xs: '100%', sm: '70%', maxWidth: '1000px' }, display: 'block', margin: 'auto' }}>
            <Typography variant="h6" mb={1}>
                {action === 'NEW' && 'Nuevo participante'}
                {action === 'EDIT' && `Editar participante #${formData.id}`}
            </Typography>
            <form onChange={handleChange} onSubmit={(e) => handleSubmit(
                e,
                formData,
                validate,
                reset,
                setDisabled,
                action,
                setAction
            )}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ width: '50%' }}>
                            <InputLabel htmlFor="first_name">Nombre</InputLabel>
                            <Input id="first_name" type="text" name="first_name" value={formData.first_name} />
                            {errors.first_name?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El nombre es requerido.
                                </Typography>
                            }
                            {errors.first_name?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El nombre es demasiado largo.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl sx={{ width: '50%' }}>
                            <InputLabel htmlFor="last_name">Apellido</InputLabel>
                            <Input id="last_name" type="text" name="last_name" value={formData.last_name} />
                            {errors.last_name?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El apellido es requerido.
                                </Typography>
                            }
                            {errors.last_name?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El apellido es demasiado largo.
                                </Typography>
                            }
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <FormControl sx={{ width: '50%' }}>
                            <InputLabel htmlFor="dni">DNI</InputLabel>
                            <Input id="dni" type="text" name="dni" value={formData.dni} />
                            {errors.dni?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El DNI es requerido.
                                </Typography>
                            }
                            {errors.dni?.type === 'minLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El DNI es demasiado corto.
                                </Typography>
                            }
                            {errors.dni?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El DNI es demasiado largo.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl sx={{ width: '50%' }}>
                            <InputLabel htmlFor="phone">Teléfono</InputLabel>
                            <Input id="phone" type="text" name="phone" value={formData.phone} />
                            {errors.phone?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El teléfono es demasiado largo.
                                </Typography>
                            }
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center' }}>
                        <FormControl sx={{ width: '50%' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Nacimiento"
                                    value={new Date(formData.birth)}
                                    onChange={value => handleChange({
                                        target: {
                                            name: 'birth',
                                            value: new Date(value?.toISOString() ?? Date.now()),
                                        }
                                    })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Masculino"
                                checked={formData.gender === 'M'}
                                onChange={() => setFormData({ ...formData, gender: 'M' })}
                            />
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Femenino"
                                checked={formData.gender === 'F'}
                                onChange={() => setFormData({ ...formData, gender: 'F' })}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <FormControl sx={{ width: '50%' }}>
                            <InputLabel id="level-select">Nivel</InputLabel>
                            <Select
                                labelId="level-select"
                                id="level"
                                value={formData.level}
                                label="Nivel"
                                name="level"
                                sx={{ width: '100%' }}
                                disabled={formData.gender === 'M'}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                {LEVELS.map((lvl: string) => (
                                    <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
                                ))}
                            </Select>
                            {formData.level?.length === 0 && formData.gender === 'F' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El nivel es requerido.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl sx={{ width: '50%' }}>
                            <InputLabel htmlFor="institution_name">Institución</InputLabel>
                            <Input id="institution_name" type="text" name="institution_name" value={formData.institution_name} />
                            {errors.institution_name?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La institución es demasiado larga.
                                </Typography>
                            }
                        </FormControl>
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