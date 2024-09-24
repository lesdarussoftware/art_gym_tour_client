import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { useParticipants } from "../hooks/useParticipants";
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/Layout";
import { AbmParticipants } from "../components/AbmParticipants";
import { ModalComponent } from "../components/ModalComponent";
import { DataGrid } from "../components/datagrid/DataGrid";

export function Participants() {

    const {
        participants,
        getParticipants,
        action,
        setAction,
        destroy,
        headCells,
        handleSubmit
    } = useParticipants();
    const participantFormData = useForm({
        defaultData: {
            id: '',
            first_name: '',
            last_name: '',
            dni: '',
            phone: '',
            institution_name: '',
            level: '',
            birth: new Date(Date.now()),
            gender: 'M'
        },
        rules: {
            first_name: { required: true, maxLength: 55 },
            last_name: { required: true, maxLength: 55 },
            dni: { required: true, minLength: 6, maxLength: 10 },
            phone: { maxLength: 25 },
            institution_name: { maxLength: 55 }
        }
    });

    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        getParticipants();
    }, [])

    const handleClose = () => {
        setAction(null);
        participantFormData.reset();
        if (confirmDelete) setConfirmDelete(false);
    }

    return (
        <Layout>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
                <DataGrid
                    headCells={headCells}
                    rows={participants}
                    showEditAction
                    showDeleteAction
                    setData={participantFormData.setFormData}
                    setAction={setAction}
                    contentHeader={
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <Button
                                variant="contained"
                                sx={{ color: '#FFF', mt: 1, mb: 3 }}
                                onClick={() => setAction('NEW')}
                            >
                                <AddCircleIcon />
                            </Button>
                        </Box>
                    }
                />
            </Box>
            <ModalComponent open={action === 'NEW' || action === 'EDIT'} onClose={handleClose}>
                <AbmParticipants
                    participantFormData={participantFormData}
                    action={action}
                    setAction={setAction}
                    handleSubmit={handleSubmit}
                />
            </ModalComponent>
            <ModalComponent open={action === 'DELETE'} onClose={handleClose}>
                <Typography variant='h6' align='center' mb={1}>
                    {`¿Eliminar el registro de ${participantFormData.formData?.first_name} 
                    ${participantFormData.formData?.last_name} (${participantFormData.formData?.dni})?`}
                </Typography>
                <Typography variant='body1' align='center' mb={3}>
                    Se eliminarán todos los datos relacionados a este participante y no podrán ser recuperados.
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
                                await destroy(participantFormData.formData.id, setAction, participantFormData.reset)
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
        </Layout>
    );
}