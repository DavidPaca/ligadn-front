// src/utils/authHelper.js

/**
 * Obtiene la información del usuario logueado desde el localStorage.
 * @returns {Object|null} Objeto con id, nombre, email o null si no existe.
 */
export const getLoggedUserInfo = () => {
    const userInfo = localStorage.getItem("user_info");
    try {
        return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
        console.error("Error al parsear user_info:", error);
        return null;
    }
};

/**
 * Obtiene específicamente el ID del usuario logueado.
 * @returns {number|null}
 */
export const getLoggedUserId = () => {
    const user = getLoggedUserInfo();
    return user ? user.id : null;
};

/**
 * Obtiene el token de autenticación.
 */
export const getAuthToken = () => {
    return localStorage.getItem("token_liga");
};