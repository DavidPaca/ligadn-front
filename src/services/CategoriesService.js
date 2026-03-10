import apiRest from './ApiRest';

const getCategories = async () => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.get('/category');
        return response.data;
    } catch (error) {
        console.error("Error al obtener categorias:", error);
        throw error;
    }
};

const createCategory = async (data) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post('/category-create', data);
        return response.data;
    } catch (error) {
        console.error("Error al crear categoria:", error);
        throw error;
    }
};

const updateCategory = async (category_id, data) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post(`/category-update/${category_id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar categoria:", error);
        throw error;
    }
};

const deleteCategory = async (category_id) => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.post(`/category-delete/${category_id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar categoria:", error);
        throw error;
    }
};

export {getCategories, createCategory, updateCategory, deleteCategory};