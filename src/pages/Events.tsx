import { useContext, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { LicenseContext } from "../providers/LicenseProvider";
import { useEvents } from "../hooks/useEvents";
import { useForm } from "../hooks/useForm";
import { useLicense } from "../hooks/useLicense";

import { Layout } from "../components/Layout";
import { AbmEvents } from "../components/events/AbmEvents";
import { WorkOnEvent } from "../components/events/WorkOnEvent";
import { ModalComponent } from "../components/ModalComponent";
import { Login } from "./Login";

export function Events() {

    const { license } = useContext(LicenseContext)

    const { isActivated, isAppActivated } = useLicense()
    const { events, getEvents, action, setAction, destroy } = useEvents();
    const eventFormData = useForm({
        defaultData: {
            id: '',
            name: '',
            description: '',
            date: new Date(Date.now()),
            location: '',
            is_active: true
        },
        rules: {
            name: { required: true, maxLength: 55 },
            description: { maxLength: 55 },
            location: { maxLength: 55 }
        }
    });

    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        isAppActivated()
    }, [])

    useEffect(() => {
        if (!action) getEvents();
    }, [action])

    const handleClose = () => {
        setAction(null);
        if (confirmDelete) setConfirmDelete(false);
    }

    if (!license.hash && !isActivated) return <Login />

    return (
        <Layout>
            {(!action || action === 'DELETE') &&
                <Button
                    variant="contained"
                    sx={{ color: '#FFF', mt: 1, mb: 3 }}
                    onClick={() => setAction('NEW')}
                >
                    <AddCircleIcon />
                </Button>
            }
            {!action && events.length === 0 &&
                <Typography variant="h5" align="center" pt={3}>
                    No hay eventos registrados.
                </Typography>
            }
            {(!action || action === 'DELETE') && events.length > 0 &&
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
                    {events.map((event) => (
                        <Box
                            key={event.id}
                            sx={{
                                p: 1,
                                mb: 1,
                                borderRadius: 1,
                                boxShadow: '1px 1px 3px #B6B6B6',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                width: { xs: '100%', md: '49%' }
                            }}
                        >
                            <Typography variant="h6">{`#${event.id} ${event.name}`}</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button size="small" variant="contained"
                                    sx={{ color: '#FFF' }}
                                    onClick={() => {
                                        eventFormData.setFormData(event);
                                        setAction('DELETE');
                                    }}
                                >
                                    <DeleteForeverIcon />
                                </Button>
                                <Button size="small" variant="contained"
                                    sx={{ color: '#FFF' }}
                                    onClick={() => {
                                        eventFormData.setFormData(event);
                                        setAction('EDIT');
                                    }}
                                >
                                    <EditIcon />
                                </Button>
                                <Button size="small" variant="contained"
                                    sx={{ color: '#FFF' }}
                                    onClick={() => {
                                        eventFormData.setFormData(event);
                                        setAction('VIEW');
                                    }}
                                >
                                    <SearchIcon />
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </Box>
            }
            {(action === 'NEW' || action === 'EDIT') &&
                <AbmEvents
                    eventFormData={eventFormData}
                    action={action}
                    setAction={setAction}
                />
            }
            {action === 'VIEW' &&
                <WorkOnEvent
                    eventFormData={eventFormData}
                    setAction={setAction}
                />
            }
            <ModalComponent open={action === 'DELETE'} onClose={handleClose}>
                <Typography variant='h6' align='center' mb={1}>
                    {`¿Eliminar el registro de ${eventFormData.formData?.name}?`}
                </Typography>
                <Typography variant='body1' align='center' mb={3}>
                    Se eliminarán todos los datos relacionados a este evento y no podrán ser recuperados.
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
                        onClick={() => destroy(eventFormData.formData.id, eventFormData.reset, setAction)}
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
        </Layout>
    );
}