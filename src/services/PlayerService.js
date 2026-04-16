import apiRest from './ApiRest'; // Importas tu instancia personalizada

const getAllPlayer = async () => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.get(`/player`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener jugador:", error);
        throw error;
    }
};

const getPlayerbyTeam = async (equipo_id) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.get(`/player-team/${equipo_id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener jugador:", error);
        throw error;
    }
};

const createPlayer = async (data) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post('/player-create', data);
        return response.data;
    } catch (error) {
        console.error("Error al crear jugador:", error);
        throw error;
    }
};

export {getAllPlayer, createPlayer, getPlayerbyTeam};