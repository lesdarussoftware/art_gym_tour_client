import { useContext } from "react";
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";

import { LicenseContext } from "../providers/LicenseProvider";
import { useForm } from "../hooks/useForm";

import { ActivationService } from "../server/activation";
import { licenses } from "../helpers/licenses";
import { useLicense } from "../hooks/useLicense";

export function Login() {

    const { setLicense } = useContext(LicenseContext)

    const { isLicenseExpired } = useLicense()
    const { formData, handleChange } = useForm({
        defaultData: { hash: '' },
        rules: {}
    });

    const handleSubmit = async () => {
        const result = licenses.find(l => l.hash === formData.hash);
        if (result && !isLicenseExpired({ ...result, created_at: new Date(result.created_at) })) {
            if (result.expiration_days === 0) await ActivationService.activate();
            setLicense({ ...result, created_at: new Date(result.created_at) });
        }
    }

    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            background: 'linear-gradient(to right, #88D9FC, #1DFDF4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingX: { xs: 1, sm: 0 }
        }}>
            <Box sx={{
                backgroundColor: '#FFF',
                width: { xs: '100%', sm: '50%' },
                maxWidth: '1200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: 1,
                borderRadius: 1,
                boxShadow: '1px 1px 3px #B6B6B6'
            }}>
                <FormControl sx={{ width: '80%' }}>
                    <InputLabel htmlFor="hash">Ingrese licencia</InputLabel>
                    <Input id="hash" type="text" name="hash" value={formData.hash} onChange={handleChange} />
                </FormControl>
                <Button
                    type="button"
                    variant="contained"
                    disabled={!formData.hash || formData.hash.length !== 36}
                    sx={{ width: '20%', color: '#FFF' }}
                    onClick={handleSubmit}
                >
                    Activar
                </Button>
            </Box>
        </Box >
    );
}