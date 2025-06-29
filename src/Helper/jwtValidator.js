export const isTokenExpired = (token) => {
    if (!token || typeof token !== 'string') return true;

    try {
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const expiryTime = decoded.exp * 1000; // Convert to milliseconds
        return expiryTime < Date.now();
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};


export const verifyToken = (token) => {
    if (!token || typeof token !== 'string') {
        console.error('Invalid token provided:', token);
        return null; 
    }
    try {

        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.error('Invalid token format:', token);
            return null;
        }
        const decoded = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null; 
    }
}

//
// export const isTokenExpired = (token) => {
//     // Check if token is valid
//     if (!token || typeof token !== 'string') {
//         console.error('Invalid token provided:', token);
//         return true; // Or handle the case as you see fit (e.g., return false or throw error)
//     }
//
//     try {
//         // Ensure the token contains three parts (header, payload, signature)
//         const tokenParts = token.split('.');
//         if (tokenParts.length !== 3) {
//             console.error('Invalid token format:', token);
//             return true;
//         }
//
//         // Decode the payload (second part) of the JWT
//         const decoded = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
//
//         // Check if the decoded token has an expiry time
//         const expiryTime = decoded.exp * 1000; // Convert expiry time to milliseconds
//         return expiryTime < Date.now();
//     } catch (error) {
//         console.error('Error decoding token:', error);
//         return true; // Return true if an error occurs while decoding
//     }
// };
