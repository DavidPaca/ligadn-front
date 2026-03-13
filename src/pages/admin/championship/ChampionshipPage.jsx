import { useEffect, useState } from "react";
// Se agregó Trophy a los imports
import { Table, Button, Space, Tooltip, Tag, Typography, Input, Form, Modal, Select, DatePicker, Row, Col,  } from "antd";
import { Edit, Trash2, Plus, Trophy, Settings, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Importar para la navegación
import { getChampionshipAC, createChampionship, updateChampionship, deleteChampionship } from "../../../services/ChampionshipService";
import Swal from "sweetalert2";

const { Text } = Typography;
const { Search, TextArea } = Input;

const ChampionshipPage = () => {
    const navigate = useNavigate(); // Inicializar el hook
    const [dataList, setDataList] = useState([]); // Datos que se muestran (filtrados)
    const [filteredData, setFilteredData] = useState([]); // Datos que se muestran (filtrados)
    const [isLoading, setIsLoading] = useState(true);
    // --- ESTADOS PARA MODALES SEPARADOS ---
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    // const [championshipsData, setChampionshipsData] = useState([]);

    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    /////////// LISTAR EQUIPOS ///////////
    const ChampionshipList = async () => {
        try {
            setIsLoading(true);
            const response = await getChampionshipAC();
            console.log("response torneos:", response);
            const dataWithKeys = response.map(item => ({
                ...item,
                key: item.championship_id
            }));
            setDataList(dataWithKeys);
            setFilteredData(dataWithKeys); // Inicializar también los filtrados
            console.log("DATA PARA FILTRAR:", dataWithKeys);
        } catch {
            Swal.fire("Error", "No se pudieron cargar los equipos", "error");
        } finally {
            setIsLoading(false);
        }
    };

    ///////// INSERTAR EQUIPO ///////////
    const dataRowCreate = async (values) => {
        try {
            // Formateamos los valores antes de enviarlos
            const dataParaEnviar = {
                ...values,
                // IMPORTANTE: Convertir a string que entienda MySQL/Laravel
                start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
                end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null,
            };
            console.log("Datos enviados al backend ACT:", dataParaEnviar);
            await createChampionship(dataParaEnviar);
            Swal.fire("¡Éxito!", "Equipo creado correctamente", "success");
            setIsCreateModalVisible(false);
            createForm.resetFields();

        } catch {
            console.error("No se pudo crear el equipo");
        } finally {
            ChampionshipList();
            setIsLoading(false);
        }
    };

    // /////////// ACTUALIZAR EQUIPO ///////////
    const dataRowUpdate = async (values) => {
        try {
            await updateChampionship(selectedEquipo.equipo_id, values);
            Swal.fire("¡Éxito!", "Equipo actualizado correctamente", "success");
            setIsUpdateModalVisible(false);
            updateForm.resetFields();
            ChampionshipList();
        } catch {
            console.error("No se pudo actualizar el equipo");
        }
    };

    // /////////// ELIMINAR EQUIPO ///////////
    const dataRowDelete = async (equipo_id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteChampionship(equipo_id);
                    Swal.fire("¡Eliminado!", "El equipo ha sido eliminado.", "success");
                    ChampionshipList();
                } catch {
                    Swal.fire("Error", "No se pudo eliminar el equipo", "error");
                }
            }
        });
    };

    /////////// FUNCIÓN DE BÚSQUEDA ///////////
    const handleSearch = (value) => {
        const term = value.toLowerCase();
        console.log("term:", term);
        const filtered = dataList.filter(item =>
            item.name.toLowerCase().includes(term) ||
            item.type.toLowerCase().includes(term)
        );
        console.log("filtered:", filtered);
        setFilteredData(filtered);
    };

    /////////// MODAL DE EDICION ///////////
    const openEditModal = (record) => {
        setSelectedEquipo(record);
        console.log('recordsss', record);
        updateForm.setFieldsValue(record); // Carga los datos en el formulario de update
        setIsUpdateModalVisible(true);
    };

    useEffect(() => {
        ChampionshipList();
    }, []);


    const columns = [
        {
            title: 'Torneo',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const typeConfig = {
                    'unique': { label: 'Único' },
                    'categories': { label: 'Por Categorías' },
                    'especial': { label: 'Invitacional' }
                };
                const { label } = typeConfig[type] || { label: type };
                return (
                    <Text> {label}</Text>
                );
            },
        },
        {
            title: 'Fecha de Inicio',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Fecha de Finalización',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (text) => <Tag color="red">{text}</Tag>
        },
        {
            title: 'Estado',
            dataIndex: 'status_championship',
            key: 'status_championship',
            render: (status) => {
                // 1. Definimos un mapeo de configuraciones según el código de la BD
                const statusConfig = {
                    'PE': { color: 'orange', texto: 'PENDIENTE' },
                    'AC': { color: 'success', texto: 'ACTIVO' },
                    'FI': { color: 'blue', texto: 'FINALIZADO' },
                    'CA': { color: 'error', texto: 'CANCELADO' }
                };
                // 2. Obtenemos la configuración actual o una por defecto si el código no existe
                const { color, texto } = statusConfig[status] || { color: 'default', texto: 'DESCONOCIDO' };
                return (
                    <Tag color={color} style={{ fontWeight: '600', borderRadius: '4px', minWidth: '90px', textAlign: 'center' }}>
                        {texto}
                    </Tag>
                );
            },
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space size="middle">
                    {/* ICONO DE REDIRECCIÓN CONDICIONAL */}
                    {record.type === 'categories' && (
                        <Tooltip title="Configurar Categorías y Fases">
                            <Button
                                type="text"
                                style={{ color: '#1890ff' }}
                                // icon={<Settings size={16} />}
                                icon={<Layers size={16} />}
                                onClick={() => navigate(`/admin/torneos/torneos-categorias/${record.championship_id}/setup`)}
                            />
                        </Tooltip>
                    )}

                    <Tooltip title="Editar">
                        <Button type="text" icon={<Edit size={16} />} onClick={() => openEditModal(record)} />
                    </Tooltip>

                    <Tooltip title="Eliminar">
                        <Button type="text" danger icon={<Trash2 size={16} />} onClick={() => dataRowDelete(record.championship_id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="equipos-page">
            {/* Encabezado Responsivo */}
            <div className="page-header-container">
                <div className="header-text">
                    <h1 className="page-title">Gestión de Torneos</h1>
                    <p className="page-subtitle">
                        Listado oficial de torneos activos en la Liga Divino Niño.
                    </p>
                </div>

                <div className="header-actions">
                    <Search
                        className="search-input"
                        placeholder="Buscar equipo..."
                        allowClear
                        onSearch={handleSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <Button
                        type="primary"
                        className="btn-add-equipo"
                        icon={<Plus size={18} />}
                        onClick={() => setIsCreateModalVisible(true)}
                    >
                        Nuevo Torneo
                    </Button>
                </div>
            </div>

            <div className="table-container" >
                <Table
                    columns={columns}
                    dataSource={filteredData} // Usamos la data filtrada
                    loading={isLoading}
                    pagination={{
                        pageSize: 10,
                        responsive: true, // Hace que la paginación sea amigable en móviles
                        showSizeChanger: false
                    }}
                    scroll={{ x: 'max-content' }} // <-- CLAVE: Permite deslizar la tabla si no cabe
                    locale={{ emptyText: 'No hay equipos registrados' }}
                />
            </div>

            {/* --- MODAL DE CREACIÓN --- */}
            <Modal
                title="Añadir Nuevo Torneo"
                open={isCreateModalVisible}
                onOk={() => createForm.submit()}
                onCancel={() => setIsCreateModalVisible(false)}
                okText="Guardar"
                centered
            >
                <Form form={createForm} layout="vertical" onFinish={dataRowCreate}>
                    <Form.Item
                        name="name"
                        label="Nombre del Campeonato"
                        rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
                    >
                        <Input placeholder="Ej: Copa de Verano 2026" />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Tipo de Torneo"
                        rules={[{ required: true, message: 'Seleccione un tipo' }]}
                    >
                        <Select
                            placeholder="Seleccione el tipo de torneo"
                            allowClear
                            showSearch
                            style={{ width: '100%' }} // Cambiado a 100% para que se vea bien en el modal
                            options={[
                                { value: 'unique', label: 'Torneo Único' },
                                { value: 'categories', label: 'Por Categorías' },
                                // { value: 'especial', label: 'Invitacional (Especial)' },
                                // { value: 'disabled', label: 'Próximamente', disabled: true },
                            ]}
                            // Si quieres usar el prefijo visual como en tu ejemplo:
                            suffixIcon={<Trophy size={14} />}
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="start_date" label="Fecha de Inicio">
                                <DatePicker style={{ width: '100%' }} placeholder="Inicio" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="end_date" label="Fecha de Finalización">
                                <DatePicker style={{ width: '100%' }} placeholder="Fin" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="description" label="Descripción" >
                        <TextArea
                            rows={4}
                            placeholder="Escriba los detalles de la vocalía aquí..."
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* --- MODAL DE EDICIÓN --- */}
            <Modal
                title="Editar Equipo"
                open={isUpdateModalVisible}
                onOk={() => updateForm.submit()}
                onCancel={() => setIsUpdateModalVisible(false)}
                okText="Actualizar"
            >
                <Form form={updateForm} layout="vertical" onFinish={dataRowUpdate}>
                    <Form.Item name="nombre_completo" label="Nombre Completo" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="nombre_corto" label="Nombre Corto">
                        <Input />
                    </Form.Item>
                    <Form.Item name="abrebiatura" label="Abreviatura" rules={[{ required: true }]}>
                        <Input maxLength={3} />
                    </Form.Item>
                    <Form.Item name="estado_campeonato" label="Estado">
                        <Select options={[{ value: 'A', label: 'ACTIVO' }, { value: 'I', label: 'INACTIVO' }]} />
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
};

export default ChampionshipPage;