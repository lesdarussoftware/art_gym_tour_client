export interface Event {
    id: number;
    name: string;
    description?: string;
    date: Date;
    location?: string;
    is_active?: boolean;
}

export interface Participant {
    id: number;
    first_name: string;
    last_name: string;
    dni: string;
    birth: Date;
    gender: 'M' | 'F';
    phone?: string;
    institution?: string;
    level: 'ESCUELA 1' | 'ESCUELA 2' | 'NIVEL 1' | 'NIVEL 2' | 'NIVEL 3' | 'NIVEL 4' | 'NIVEL 5' | 'NIVEL 6' | 'NIVEL 7' | 'NIVEL 8' | 'NIVEL 9';
}