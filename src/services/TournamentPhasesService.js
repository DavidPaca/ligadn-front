import apiRest from './ApiRest';

const getTournamentPhasesAll = async () => {
    try {
        // Laravel devuelve la data en response.data
        const response = await apiRest.get('/tournament-phase');
        return response.data;
    } catch (error) {
        console.error("Error al obtener torneos:", error);
        throw error;
    }
};

export {getTournamentPhasesAll};