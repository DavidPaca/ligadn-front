import apiRest from './ApiRest';

const getChampionshipCategoriesByID = async (championship_category_id) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.get('/championship-category/' + championship_category_id);
        return response.data;
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        throw error;
    }
};

const createChampionshipCategory = async (data) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post('/championship-category-create', data);
        return response.data;
    } catch (error) {
        console.error("Error al crear categoría:", error);
        throw error;
    }
};

const updateChampionshipCategory = async (championship_category_id, data) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post(`/championship-category-update/${championship_category_id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        throw error;
    }
};

const deleteChampionshipCategory = async (championship_category_id) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post(`/championship-category-delete/${championship_category_id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        throw error;
    }
};

export {getChampionshipCategoriesByID, createChampionshipCategory, updateChampionshipCategory, deleteChampionshipCategory};