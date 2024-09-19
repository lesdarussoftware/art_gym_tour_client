import { createContext, useState, ReactNode } from "react";
import { Alert, Snackbar } from "@mui/material";

type Severity = 'success' | 'info' | 'warning' | 'error';

interface MessageContextProps {
    openMessage: boolean;
    setOpenMessage: (value: boolean) => void;
    severity: Severity;
    setSeverity: (value: Severity) => void;
    message: string;
    setMessage: (value: string) => void;
}

export const MessageContext = createContext<MessageContextProps>({
    openMessage: false,
    setOpenMessage: () => { },
    severity: 'success',
    setSeverity: () => { },
    message: '',
    setMessage: () => { }
});

interface MessageProviderProps {
    children: ReactNode;
}

export function MessageProvider({ children }: MessageProviderProps) {

    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [severity, setSeverity] = useState<Severity>('success');
    const [message, setMessage] = useState<string>('');

    return (
        <MessageContext.Provider value={{
            openMessage,
            setOpenMessage,
            severity,
            setSeverity,
            message,
            setMessage
        }}>
            {children}
            <Snackbar
                open={openMessage}
                autoHideDuration={3000}
                onClose={() => setOpenMessage(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </MessageContext.Provider>
    )
}
