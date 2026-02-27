import { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Tag, Typography, Input, Form, Modal, Popconfirm, Select } from "antd";

import { Edit, Trash2, Plus, ShieldCheck } from "lucide-react";
import { getVocalia, createVocalia, updateVocalia, deleteVocalia } from "../../../services/VocaliaService";
import Swal from "sweetalert2";

const { Text } = Typography;
const { Search, TextArea } = Input;

function VocaliaPage() {
    const [vocaliaData, setVocaliaData] = useState([]); // Base de datos completa
    const [filteredData, setFilteredData] = useState([]); // Datos que se muestran (filtrados)
    const [isLoading, setIsLoading] = useState(true);
    // --- ESTADOS PARA MODALES SEPARADOS ---
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedVocalia, setSelectedVocalia] = useState(null);

    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    /////////// LISTAR VOCALIAS ///////////
    const VocaliaList = async () => {
        try {
            setIsLoading(true);
            const response = await getVocalia();
            const dataWithKeys = response.map(item => ({
                ...item,
                key: item.vocalia_id
            }));
            console.log("dataWithKeys::", dataWithKeys);
            setVocaliaData(dataWithKeys);
            setFilteredData(dataWithKeys); // Inicializar también los filtrados
        } catch {
            Swal.fire("Error", "No se pudieron cargar las vocalias", "error");
        } finally {
            setIsLoading(false);
        }
    };

    /////////// INSERTAR VOCALIA ///////////
    const VocaliaCreate = async (values) => {
        try {
            await createVocalia(values);
            Swal.fire("¡Éxito!", "Vocalia creada correctamente", "success");
            setIsCreateModalVisible(false);
            createForm.resetFields();
            VocaliaList();
        } catch {
            console.error("No se pudo crear la vocalia");
        }
    };

    /////////// ACTUALIZAR VOCALIA ///////////
    const VocaliaUpdate = async (values) => {
        try {
            await updateVocalia(selectedVocalia.vocalia_id, values);
            Swal.fire("¡Éxito!", "Vocalia actualizada correctamente", "success");
            setIsUpdateModalVisible(false);
            updateForm.resetFields();
            VocaliaList();
        } catch {
            console.error("No se pudo actualizar la vocalia");
        }
    };

    /////////// ELIMINAR VOCALIA ///////////
    const VocaliaDelete = async (vocalia_id) => {
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
                    await deleteVocalia(vocalia_id);
                    Swal.fire("¡Eliminado!", "La vocalia ha sido eliminada.", "success");
                    VocaliaList();
                } catch {
                    Swal.fire("Error", "No se pudo eliminar la vocalia", "error");
                }
            }
        });
    };

    /////////// FUNCIÓN DE BÚSQUEDA ///////////
    const handleSearch = (value) => {
        console.log("value::", value);
        const term = value.toLowerCase();
        console.log("term::", term);
        const filtered = vocaliaData.filter(item =>
            item.details.toLowerCase().includes(term) ||
            item.Precio.toLowerCase().includes(term)
        );
        setFilteredData(filtered);
    };

    /////////// MODAL DE EDICION ///////////
    const openEditModal = (record) => {
        console.log("record::", record);
        setSelectedVocalia(record);
        updateForm.setFieldsValue(record); // Carga los datos en el formulario de update
        setIsUpdateModalVisible(true);
    };

    useEffect(() => {
        VocaliaList();
    }, []);


    const columns = [
        {
            title: 'Vocalia',
            dataIndex: 'details',
            key: 'details',
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
            render: (value) => (
                <Text >
                    {`$ ${Number(value).toFixed(2)}`}
                </Text>
            ),
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const color = status === 'V' ? 'success' : 'error';
                const texto = status === 'V' ? 'ACTIVO' : 'INACTIVO';
                return (
                    <Tag color={color} style={{ fontWeight: '600', borderRadius: '4px' }}>
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
                    <Tooltip title="Editar">
                        <Button type="text" icon={<Edit size={16} />} onClick={() => openEditModal(record)} />
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <Button type="text" danger icon={<Trash2 size={16} />} onClick={() => VocaliaDelete(record.vocalia_id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="vocalia-page">
            {/* Encabezado Responsivo */}
            <div className="page-header-container">
                <div className="header-text">
                    <h1 className="page-title">Gestión de Vocalias</h1>
                    <p className="page-subtitle">
                        Listado de voalias activas en el presente campeonato
                    </p>
                </div>

                <div className="header-actions">
                    <Search
                        className="search-input"
                        placeholder="Buscar vocalia"
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
                        Nuevo Equipo
                    </Button>
                </div>
            </div>

            <div className="table-container" style={{ background: '#fff', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <Table
                    columns={columns}
                    dataSource={filteredData} // Usamos la data filtrada
                    loading={isLoading}
                    pagination={{
                        pageSize: 10,
                        responsive: true, // Hace que la paginación sea amigable en móviles
                        showSizeChanger: false
                    }}
                    scroll={{ x: 'max-content' }}
                    locale={{ emptyText: 'No hay vocalias registradas' }}
                />
            </div>

            {/* --- MODAL DE CREACIÓN --- */}
            <Modal
                title="Añadir Nueva Vocalia"
                open={isCreateModalVisible}
                onOk={() => createForm.submit()}
                onCancel={() => setIsCreateModalVisible(false)}
                okText="Guardar"
            >
                <Form form={createForm} layout="vertical" onFinish={VocaliaCreate}>
                    <Form.Item name="details" label="Nombre Vocalía" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Precio" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
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
                title="Editar Vocalia"
                open={isUpdateModalVisible}
                onOk={() => updateForm.submit()}
                onCancel={() => setIsUpdateModalVisible(false)}
                okText="Actualizar"
            >
                <Form form={updateForm} layout="vertical" onFinish={VocaliaUpdate}>
                    <Form.Item name="details" label="Nombre Vocalía" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Precio">
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Descripción">
                        <TextArea rows={4} showCount maxLength={500} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default VocaliaPage;