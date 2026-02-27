import { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Tag, Typography, Input, Form, Modal, Popconfirm, Select } from "antd";
import { Edit, Trash2, Plus, ShieldCheck } from "lucide-react";
import { getEquipo, createEquipo, updateEquipo, deleteEquipo } from "../../../services/EquipoService";
import Swal from "sweetalert2";

const { Text } = Typography;
const { Search } = Input;

function EquiposPage() {
  const [equiposData, setEquiposData] = useState([]); // Base de datos completa
  const [filteredData, setFilteredData] = useState([]); // Datos que se muestran (filtrados)
  const [isLoading, setIsLoading] = useState(true);
  // --- ESTADOS PARA MODALES SEPARADOS ---
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState(null);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  /////////// LISTAR EQUIPOS ///////////
  const EquipoList = async () => {
    try {
      setIsLoading(true);
      const response = await getEquipo();
      const dataWithKeys = response.map(item => ({
        ...item,
        key: item.equipo_id
      }));
      setEquiposData(dataWithKeys);
      setFilteredData(dataWithKeys); // Inicializar también los filtrados
    } catch {
      Swal.fire("Error", "No se pudieron cargar los equipos", "error");
    } finally {
      setIsLoading(false);
    }
  };

  /////////// INSERTAR EQUIPO ///////////
  const EquipoCreate = async (values) => {
    try {
      await createEquipo(values);
      Swal.fire("¡Éxito!", "Equipo creado correctamente", "success");
      setIsCreateModalVisible(false);
      createForm.resetFields();
      EquipoList();
    } catch {
      console.error("No se pudo crear el equipo");
    }
  };

  /////////// ACTUALIZAR EQUIPO ///////////
  const EquipoUpdate = async (values) => {
    try {
      await updateEquipo(selectedEquipo.equipo_id, values);
      Swal.fire("¡Éxito!", "Equipo actualizado correctamente", "success");
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      EquipoList();
    } catch {
      console.error("No se pudo actualizar el equipo");
    }
  };

  /////////// ELIMINAR EQUIPO ///////////
  const EquipoDelete = async (equipo_id) => {
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
          await deleteEquipo(equipo_id);
          Swal.fire("¡Eliminado!", "El equipo ha sido eliminado.", "success");
          EquipoList();
        } catch {
          Swal.fire("Error", "No se pudo eliminar el equipo", "error");
        }
      }
    });
  };

  /////////// FUNCIÓN DE BÚSQUEDA ///////////
  const handleSearch = (value) => {
    const term = value.toLowerCase();
    const filtered = equiposData.filter(item =>
      item.nombre_completo.toLowerCase().includes(term) ||
      item.nombre_corto.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };

  /////////// MODAL DE EDICION ///////////
  const openEditModal = (record) => {
    setSelectedEquipo(record);
    updateForm.setFieldsValue(record); // Carga los datos en el formulario de update
    setIsUpdateModalVisible(true);
  };

  useEffect(() => {
    EquipoList();
  }, []);


  const columns = [
    {
      title: 'Equipo',
      dataIndex: 'nombre_completo',
      key: 'nombre_completo',
      render: (text) => (
        <Space>
          <div className="team-logo-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', borderRadius: '6px', padding: '4px' }}>
            <ShieldCheck size={18} color="#64748b" />
          </div>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Nombre Corto',
      dataIndex: 'nombre_corto',
      key: 'nombre_corto',
    },
    {
      title: 'Abreviatura',
      dataIndex: 'abrebiatura',
      key: 'abrebiatura',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Estado',
      dataIndex: 'estado_campeonato',
      key: 'estado_campeonato',
      render: (estado_campeonato) => {
        // Definimos el color y el texto según el valor de la base de datos
        // Si recibes 'A' o 'I', aquí lo mapeamos a etiquetas visuales
        const color = estado_campeonato === 'A' ? 'success' : 'error';
        const texto = estado_campeonato === 'A' ? 'ACTIVO' : 'INACTIVO';

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
            <Button type="text" danger icon={<Trash2 size={16} />} onClick={() => EquipoDelete(record.equipo_id)} />
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
          <h1 className="page-title">Gestión de Equipos</h1>
          <p className="page-subtitle">
            Listado oficial de clubes inscritos en la Liga Divino Niño.
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
            Nuevo Equipo
          </Button>
        </div>
      </div>

      {/* <div className="table-container" style={{ background: '#fff', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}> */}
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
        title="Añadir Nuevo Equipo"
        open={isCreateModalVisible}
        onOk={() => createForm.submit()}
        onCancel={() => setIsCreateModalVisible(false)}
        okText="Guardar"
      >
        <Form form={createForm} layout="vertical" onFinish={EquipoCreate}>
          <Form.Item name="nombre_completo" label="Nombre Completo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nombre_corto" label="Nombre Corto">
            <Input />
          </Form.Item>
          <Form.Item name="abrebiatura" label="Abreviatura" rules={[{ required: true }]}>
            <Input maxLength={3} />
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
        <Form form={updateForm} layout="vertical" onFinish={EquipoUpdate}>
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
    </div>
  );
}

export default EquiposPage;