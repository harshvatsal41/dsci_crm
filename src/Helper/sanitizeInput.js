function sanitize(value) {
    if (typeof value === 'string') {
        return value.replace(/\$/g, '').replace(/\./g, '').trim();
    }
    return value;
}

export default function sanitizeInput(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sanitizeInput);
    } else if (obj && typeof obj === 'object') {
        const clean = {};
        for (const key in obj) {
            // Disallow dangerous keys
            if (!key.startsWith('$') && !key.includes('.')) {
                clean[key] = sanitizeInput(obj[key]);
            }
        }
        return clean;
    }
    return sanitize(obj);
}
