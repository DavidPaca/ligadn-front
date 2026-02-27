import apiRest from './ApiRest'; // Importas tu instancia personalizada

const getEquipo = async () => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.get('/equipo');
        // console.log('Equipos obtenidos SERVICE:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener equipos:", error);
        throw error;
    }
};

const createEquipo = async (data) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post('/equipo-create', data);
        return response.data;
    } catch (error) {
        console.error("Error al crear equipo:", error);
        throw error;
    }
};

const updateEquipo = async (equipo_id, data) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post(`/equipo-update/${equipo_id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar equipo:", error);
        throw error;
    }
};

const deleteEquipo = async (equipo_id) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post(`/equipo-delete/${equipo_id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar equipo:", error);
        throw error;
    }
};

export {getEquipo, createEquipo, updateEquipo, deleteEquipo};