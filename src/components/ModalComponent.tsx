import { Backdrop, Box, Modal, Fade } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    open: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClose: any;
}

export function ModalComponent({ children, open, onClose }: Props) {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        boxShadow: 24,
        padding: 2,
        borderRadius: 1,
        width: '80vw',
        maxWidth: 1300
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 10,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    {children}
                </Box>
            </Fade>
        </Modal>
    );
}