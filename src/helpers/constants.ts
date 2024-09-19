export const LEVELS = [
    'ESCUELA 1',
    'ESCUELA 2',
    'NIVEL 1',
    'NIVEL 2',
    'NIVEL 3',
    'NIVEL 4',
    'NIVEL 5',
    'NIVEL 6',
    'NIVEL 7',
    'NIVEL 8',
    'NIVEL 9'
];

export const CATEGORIES_GAF = [
    'PULGUITAS',
    'PREMINI',
    'MINI',
    'PRE INFANTIL',
    'INFANTIL',
    'JUVENIL',
    'MAYOR'
];

export const CATEGORIES_GAM = [
    'PULGUITAS',
    'MINI',
    'PRE INFANTIL',
    'INFANTIL',
    'CADETES',
    'JUVENILES',
    'JUNIOR',
    'MAYOR',
    'SENIOR'
];

export const CATEGORIES_BY_AGE = {
    'F': {
        'PULGUITAS': [3, 5],
        'PREMINI': [6, 7],
        'MINI': [8, 9],
        'PRE INFANTIL': [10, 11],
        'INFANTIL': [12, 13],
        'JUVENIL': [14, 15],
        'MAYOR': [16]
    },
    'M': {
        'PULGUITAS': [3, 5],
        'MINI': [6, 7],
        'PRE INFANTIL': [8, 9],
        'INFANTIL': [10, 11],
        'CADETES': [12, 13],
        'JUVENILES': [14, 15],
        'JUNIOR': [16, 17],
        'MAYOR': [18, 34],
        'SENIOR': [35]
    }
}

export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
}