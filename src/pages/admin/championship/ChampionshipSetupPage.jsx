import { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Select, Form, Card, Typography } from "antd";
import { Edit, Trash2, Save, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getCategories } from "../../../services/CategoriesService";
import { getTournamentPhasesAll } from "../../../services/TournamentPhasesService";
import { getChampionshipACById } from "../../../services/ChampionshipService";
import { getChampionshipCategoriesByID } from "../../../services/ChampionshipCategoriesService";


const { Title } = Typography;

const ChampionshipSetupPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);
    // --- ESTADOS PARA LA DATA DE LOS SERVICIOS ---
    const [categories, setCategories] = useState([]);
    const [phases, setPhases] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [championshipName, setChampionshipName] = useState("");
    const [championshipCategories, setChampionshipCategories] = useState([]);
    const [selectedCategoryID, setSelectedCategoryID] = useState(null);

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
            const response = await getChampionshipCategoriesByID(id, selectedCategoryID);

            const dataWithKeys = response.map(item => ({
                ...item,                              // ← aquí se copia category_id
                key: item.championship_category_id
            }));
            setChampionshipCategories(dataWithKeys); // ← cada record tiene category_id
        } catch (error) {
            console.error("Error cargando categorías del campeonato:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onFinish = (values) => {
        // Aquí iría tu servicio para guardar en la BD
        const newEntry = {
            key: Date.now(),
            categoria: values.categoria,
            fase: values.fase
        };
        setDataSource([...dataSource, newEntry]);
        form.resetFields();
        Swal.fire("Guardado", "Configuración añadida a la tabla", "success");
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

    const columns = [
        {
            title: 'Categoría',
            render: (_, record) => {
                const currentCategoryId = categories.find(
                    cat => cat.category_id === record.category_id
                );
                setSelectedCategoryID(currentCategoryId);

                console.log("ID de la categoría en esta fila:", currentCategoryId);
                const genderLabel = record.gender === 'M' ? 'Masculino' :
                    record.gender === 'F' ? 'Femenino' :
                        record.gender;
                return `${record.details} - ${genderLabel}`;
            },
            key: 'category_gender_combined'
        },
        {
            title: 'Fase de campeonato',
            dataIndex: 'game_system',
            key: 'game_system',
            render: (text) => {
                const systems = {
                    'league': 'League (Todos contra todos)',
                    'playoffs': 'Playoffs (Eliminatorias)',
                    'mixed': 'Mixed (Todos contra todos + Eliminatorias)'
                };
                return systems[text] || text;
            }
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Editar"><Button type="text" icon={<Edit size={16} />} /></Tooltip>
                    <Tooltip title="Borrar">
                        <Button
                            type="text"
                            danger
                            icon={<Trash2 size={16} />}
                            onClick={() => setDataSource(dataSource.filter(item => item.key !== record.key))}
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
                            {championshipName || "Cargando..."}
                        </Title>
                    </div>
                }
            >
                <Form form={form} layout="vertical" onFinish={onFinish} loading={isLoading}>
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
                            <Button type="primary" htmlType="submit" icon={<Save size={18} />}>
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