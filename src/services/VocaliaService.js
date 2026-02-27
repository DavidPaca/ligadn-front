import apiRest from './ApiRest';

const getVocalia = async () => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.get('/vocalia');
        return response.data;
    } catch (error) {
        console.error("Error al obtener vocalia:", error);
        throw error;
    }
};

const createVocalia = async (data) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post('/vocalia-create', data);
        return response.data;
    } catch (error) {
        console.error("Error al crear vocalia:", error);
        throw error;
    }
};

const updateVocalia = async (vocalia_id, data) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post(`/vocalia-update/${vocalia_id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar vocalia:", error);
        throw error;
    }
};

const deleteVocalia = async (vocalia_id) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post(`/vocalia-delete/${vocalia_id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar vocalia:", error);
        throw error;
    }
};

export {getVocalia, createVocalia, updateVocalia, deleteVocalia};
