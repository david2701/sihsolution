"use client";

import { useEffect, useState } from "react";

export default function CurrentDate() {
    const [dateStr, setDateStr] = useState("");

    useEffect(() => {
        setDateStr(
            new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        );
    }, []);

    if (!dateStr) return null; // Render nothing on server/initial hydration

    // Capitalize first letter
    return <span>{dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}</span>;
}
