import apiRest from './ApiRest';

const getChampionship = async () => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.get('/championship');
        return response.data;
    } catch (error) {
        console.error("Error al obtener campeonatos:", error);
        throw error;
    }
};

const getChampionshipAC = async () => {
    try {
        const response = await apiRest.get(`/championship-active`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener campeonatos:", error);
        throw error;
    }
};

const getChampionshipACById = async (championship_id) => {
    try {
        const response = await apiRest.get(`/championship-unique/${championship_id}`);  ///championship-unique/{championship_id}
        return response.data;
    } catch (error) {
        console.error("Error al obtener campeonatos:", error);
        throw error;
    }
};

const createChampionship = async (data) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post('/championship-create', data);
        return response.data;
    } catch (error) {
        console.error("Error al crear campeonato:", error);
        throw error;
    }
};

const updateChampionship = async (championship_id, data) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post(`/championship-update/${championship_id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar campeonato:", error);
        throw error;
    }
};

const deleteChampionship = async (championship_id) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post(`/championship-delete/${championship_id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar campeonato:", error);
        throw error;
    }
};

export {getChampionship, createChampionship, updateChampionship, deleteChampionship, getChampionshipAC, getChampionshipACById};