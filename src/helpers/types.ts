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

export interface EventParticipant {
    id: number;
    event_id: number;
    participant_id: number;
    participant_institution_name?: string;
    participant_level?: 'ESCUELA 1' | 'ESCUELA 2' | 'NIVEL 1' | 'NIVEL 2' | 'NIVEL 3' | 'NIVEL 4' | 'NIVEL 5' | 'NIVEL 6' | 'NIVEL 7' | 'NIVEL 8' | 'NIVEL 9';
    category: 'PULGUITAS' | 'PREMINI' | 'MINI' | 'PRE INFANTIL' | 'INFANTIL' | 'CADETES' | 'JUVENILES' | 'JUNIOR' | 'MAYOR' | 'SENIOR';
}

export interface NoteGaf {
    id: number;
    event_participant_id: number;
    salto_note: number;
    salto_nd: number;
    salto_ne: number;
    paralelas_note: number;
    paralelas_nd: number;
    paralelas_ne: number;
    viga_note: number;
    viga_nd: number;
    viga_ne: number;
    suelo_note: number;
    suelo_nd: number;
    suelo_ne: number;
    penalization: number;
}

export interface NoteGam {
    id: number;
    event_participant_id: number;
    salto_note: number;
    salto_nd: number;
    salto_ne: number;
    salto_penalization: number;
    paralelas_note: number;
    paralelas_nd: number;
    paralelas_ne: number;
    paralelas_penalization: number;
    barra_fija_note: number;
    barra_fija_nd: number;
    barra_fija_ne: number;
    barra_fija_penalization: number;
    suelo_note: number;
    suelo_nd: number;
    suelo_ne: number;
    suelo_penalization: number;
    arzones_note: number;
    arzones_nd: number;
    arzones_ne: number;
    arzones_penalization: number;
    anillas_note: number;
    anillas_nd: number;
    anillas_ne: number;
    anillas_penalization: number;
}