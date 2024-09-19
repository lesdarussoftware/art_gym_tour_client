import { useState } from "react";
import { format } from "date-fns";

import { ActivationService } from "../server/activation";
import { License } from "../providers/LicenseProvider";

export function useLicense() {

    const [isActivated, setIsActivated] = useState(false)

    async function isAppActivated() {
        const result = await ActivationService.isActivated();
        setIsActivated(result);
    }

    function isLicenseExpired(license: License) {
        if (!license.created_at || !license.expiration_days) return false;
        const createdAt = new Date(license.created_at); // Convertir a objeto Date
        const expirationDays = license.expiration_days;

        // Calcular la fecha de expiración
        const expirationDate = new Date(createdAt);
        expirationDate.setDate(expirationDate.getDate() + expirationDays);

        // Obtener la fecha actual
        const currentDate = new Date();

        // Comparar si la fecha actual es mayor que la fecha de expiración
        return currentDate > expirationDate;
    }

    function getExpirationDate(license: License) {
        if (!license.created_at || !license.expiration_days) return false;
        const createdAt = new Date(license.created_at); // Convertir a objeto Date
        const expirationDays = license.expiration_days;

        // Sumar los días de expiración a la fecha de creación
        const expirationDate = new Date(createdAt);
        expirationDate.setDate(expirationDate.getDate() + expirationDays);

        return format(expirationDate, 'dd/MM/yyyy');
    }

    return {
        isActivated,
        getExpirationDate,
        isLicenseExpired,
        isAppActivated
    }
}