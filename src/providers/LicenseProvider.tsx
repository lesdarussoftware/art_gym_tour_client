import { createContext, useState, ReactNode } from "react";

// Definimos el tipo License
export type License = {
    hash: string | null;
    created_at: Date | null;
    expiration_days: number | null;
};

// Tipo para el contexto
type LicenseContextType = {
    license: License;
    setLicense: (license: License) => void;
};

// Creamos el contexto con los tipos definidos
export const LicenseContext = createContext<LicenseContextType>({
    license: { hash: null, created_at: null, expiration_days: null },
    setLicense: () => { },
});

// Definimos el tipo de las props del LicenseProvider
type LicenseProviderProps = {
    children: ReactNode;
};

export function LicenseProvider({ children }: LicenseProviderProps) {
    // Usamos el estado para manejar la licencia
    const [license, setLicense] = useState<License>({
        hash: null,
        created_at: null,
        expiration_days: null,
    });

    return (
        <LicenseContext.Provider value={{ license, setLicense }}>
            {children}
        </LicenseContext.Provider>
    );
}
