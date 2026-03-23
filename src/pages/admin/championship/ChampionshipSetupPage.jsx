import { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Select, Form, Card, Typography } from "antd";
import { Edit, Trash2, Save, ArrowLeft, Layers } from "lucide-react";   
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getCategories } from "../../../services/CategoriesService";
import { getTournamentPhasesAll } from "../../../services/TournamentPhasesService";
import { getChampionshipACById } from "../../../services/ChampionshipService";
import { getChampionshipCategoriesByID } from "../../../services/ChampionshipCategoriesService";
import { createChampionshipCategory, deleteChampionshipCategory } from "../../../services/ChampionshipCategoriesService";

const { Title } = Typography;

const ChampionshipSetupPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    // const [dataSource, setDataSource] = useState([]);
    // --- ESTADOS PARA LA DATA DE LOS SERVICIOS ---
    const [categories, setCategories] = useState([]);
    const [phases, setPhases] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [championshipName, setChampionshipName] = useState("");
    const [championshipCategories, setChampionshipCategories] = useState([]);
    const [selectedCategoryID, setSelectedCategoryID] = useState(null);
    // const [championshipCategoryID, setChampionshipCategoryID] = useState(null);
    // const [championshipCategoriesID setChampionshipCategoriesID] = useState();
    // const [championshipoCategoryID, setChampionshipoCategoryID] = useState(null);
    

    //////////// CATEGORIAS LISTAR ////////////
    const CategoriesList = async () => {
        try {
            setIsLoading(true);
            const response = await getCategories();
            console.log("response Categorias:", response);
            const dataWithKeys = response.map(item => ({
                ...item,
                key: item.category_id
            }));
            setCategories(dataWithKeys);
            setIsLoading(false);
        } catch {
            Swal.fire("Error", "No se pudieron cargar las categorías", "error");
        } finally {
            setIsLoading(false);
        }
    };

    //////////// TORNEOS LISTAR ////////////
    const PhasesList = async () => {
        try {
            setIsLoading(true);
            const response = await getTournamentPhasesAll();
            console.log("response FASes:", response);
            const dataWithKeys = response.map(item => ({
                ...item,
                key: item.tournament_phase_id
            }));
            setPhases(dataWithKeys);
            setIsLoading(false);
        } catch {
            Swal.fire("Error", "No se pudieron cargar las fases", "error");
        } finally {
            setIsLoading(false);
        }
    };

    /////////// CHAMPIONATOS LISTAR ///////////
    const ChampionshipList = async () => {
        try {
            setIsLoading(true);
            const response = await getChampionshipACById(id);

            // Como la data viene como [{...}], accedemos al índice 0
            if (response && response.length > 0) {
                setChampionshipName(response[0].name);
            }

            // Si necesitas llenar la tabla con algo que venga de ahí, mantén esto:
            const dataWithKeys = response.map(item => ({
                ...item,
                key: item.championship_id
            }));
            console.log("DATA:", dataWithKeys);
            // setDataSource(dataWithKeys); // Ojo: esto borraría lo que el usuario agregue manualmente
        } catch (error) {
            Swal.fire("Error", "No se pudo cargar el nombre del torneo", error);
        } finally {
            setIsLoading(false);
        }
    };

    /////////// CHAMPIONSHIP-CATEGORIES LISTAR ///////////
    const ChampionshipCategoriesList = async () => {
        try {
            setIsLoading(true);
            // Enviamos el ID del campeonato. 
            // Si 'selectedCategoryID' es null, el backend debería retornar todas las del torneo.
            console.log("ID del campeonato:", id);
            console.log("ID de la categoría seleccionada:", selectedCategoryID);
            // const response = await getChampionshipCategoriesByID(id, selectedCategoryID);
            const response = await getChampionshipCategoriesByID(id);

            const dataWithKeys = response.map(item => ({
                ...item,                              // ← aquí se copia category_id
                key: item.championship_category_id
            }));
            setChampionshipCategories(dataWithKeys); // ← cada record tiene category_id
            setSelectedCategoryID(null);
        } catch (error) {
            console.error("Error cargando categorías del campeonato:", error);
        } finally {
            setIsLoading(false);
        }
    };

    ///////////  CHAMPIONSHIP-CATEGORIES  INSERTAR ///////////
    const dataRowCreate = async (values) => {
        try {
            setIsLoading(true);

            // Estructuramos la data para el servicio createChampionshipCategory
            const dataToSave = {
                championship_id: id,            // Importante: viene de useParams
                category_id: values.categoria,  // Viene del Select
                tournament_phase_id: values.fase, // Viene del Select
                start_date: null,               // Opcionales según tu form actual
                end_date: null
            };
            console.log("Enviando a createChampionshipCategory:", dataToSave);
            await createChampionshipCategory(dataToSave);
            Swal.fire("¡Éxito!", "Categoría configurada correctamente", "success");
            form.resetFields(); // Limpiar selectores
            ChampionshipCategoriesList(); // Recargar la tabla

        } catch (error) {
            console.error("No se pudo crear la categoría:", error);
            Swal.fire("Error", "No se pudo guardar la configuración", "error");
        } finally {
            setIsLoading(false);
        }
    };

    /////////// ACTUALIZAR CHAMPIONSHIP-CATEGORIES ///////////
    // const dataRowUpdate = async (values) => {
    //     try {
    //         // await updateChampionshipCategory(selectedCategoryID, values);
    //         Swal.fire("¡Éxito!", "Categoría actualizada correctamente", "success");
    //         setIsUpdateModalVisible(false);
    //         updateForm.resetFields();
    //         ChampionshipCategoriesList();
    //     } catch {
    //         console.error("No se pudo actualizar la categoría");
    //     }
    // };

    /////////// ELIMINAR CHAMPIONSHIP-CATEGORIES ///////////
    const dataRowDelete = async (championshipCategoryId) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Se eliminará esta categoría de la configuración del torneo",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                setIsLoading(true);
                await deleteChampionshipCategory(championshipCategoryId);
                Swal.fire("¡Eliminado!", "Registro borrado.", "success");
                ChampionshipCategoriesList();
            } catch {
                Swal.fire("Error", "No se pudo eliminar", "error");
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        CategoriesList();
    }, []);
    useEffect(() => {
        PhasesList();
    }, []);
    useEffect(() => {
        ChampionshipList();
    }, []);
    useEffect(() => {
        ChampionshipCategoriesList();
    }, []);

    // /////////// COLUMNAS CORREGIDAS ///////////
    const columns = [
        {
            title: 'Categoría',
            key: 'category_details',
            render: (_, record) => {
                // Si el backend ya trae 'details' y 'gender' en 'record', úsalos directamente
                // Si no, búscalo en la lista de categories cargada
                const catInfo = categories.find(c => c.category_id === record.category_id);
                const details = record.details || catInfo?.details || "Cargando...";
                const gender = record.gender || catInfo?.gender;

                const genderLabel = gender === 'M' ? 'Masculino' :
                    gender === 'F' ? 'Femenino' : gender;

                return `${details} - ${genderLabel}`;
            },
        },
        {
            title: 'Fase de campeonato',
            dataIndex: 'phase_details', // Ajusta según el campo que devuelva tu GET
            key: 'tournament_phase_id',
            render: (text, record) => {
                // Si el backend no devuelve el nombre de la fase, búscalo por ID
                if (text) return text;
                const phaseInfo = phases.find(p => p.tournament_phase_id === record.tournament_phase_id);
                return phaseInfo?.tournament_phase_id || "Sin definir";
            }
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Configurar Clasificacion y Rankings">
                        <Button
                            type="text"
                            style={{ color: '#1890ff' }}
                            icon={<Layers size={16} />}                           
                        />
                    </Tooltip>
                    <Tooltip title="Editar">    
                        <Button
                            type="text"
                            icon={<Edit size={16} />}                           
                        />
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <Button
                            type="text"
                            danger
                            icon={<Trash2 size={16} />}
                            onClick={() => dataRowDelete(record.championship_category_id)}
                            setChampionshipoCategoryID={record.championship_category_id}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];


    return (
        <div style={{ padding: '24px' }}>
            <Button
                icon={<ArrowLeft size={16} />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: 16 }}
            > Volver </Button>

            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Title level={4} style={{ margin: 0, color: '#595959', fontWeight: 400 }}>
                            Configuración de:
                        </Title>
                        <Title level={4} style={{ margin: 0, color: '#1890ff', fontWeight: 600 }}>
                            {championshipName || "Cargando..."} : {id}
                        </Title>
                    </div>
                }
            >
                <Form form={form} layout="vertical" onFinish={dataRowCreate} loading={isLoading}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                        <Form.Item
                            name="categoria"
                            label="Selecciona una categoría"
                            rules={[{ required: true, message: 'Requerido' }]}
                            style={{ flex: 1 }}
                        >
                            <Select
                                placeholder="Seleccione categoría"
                                showSearch
                                // optionFilterProp="label"
                                // IMPORTANTE: Asegúrate de que el mapeo devuelva un objeto limpio
                                options={categories.map(category => {
                                    const genderLabel = category.gender === 'M' ? 'Masculino' :
                                        category.gender === 'F' ? 'Femenino' :
                                            category.gender;
                                    return {
                                        value: category.category_id, // Debe ser un string o number único
                                        label: `${category.details} - ${genderLabel}`
                                    };
                                })}
                            />
                        </Form.Item>

                        <Form.Item
                            name="fase"
                            label="Fase de campeonato"
                            rules={[{ required: true, message: 'Requerido' }]}
                            style={{ flex: 1 }}
                        >
                            <Select
                                placeholder="Seleccione fase"
                                showSearch
                                options={phases.map(phase => ({
                                    value: phase.tournament_phase_id || Math.random(),
                                    label: phase.details || 'Fase sin nombre'
                                }))}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<Save size={18} />} style={{ marginRight: 16 }}>
                                Guardar
                            </Button>
                        </Form.Item>
                    </div>
                </Form>

                <Table
                    dataSource={championshipCategories}
                    columns={columns}
                    style={{ marginTop: 24 }}
                    locale={{ emptyText: 'No hay configuraciones guardadas' }}
                />
            </Card>
        </div>
    );
};

export default ChampionshipSetupPage;