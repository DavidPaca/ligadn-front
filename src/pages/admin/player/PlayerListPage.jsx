import React from 'react';
import { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Tag, Typography, Input, Form, Modal, Popconfirm, Select } from "antd";
import Swal from "sweetalert2";
import { Edit, Trash2, Plus, ShieldCheck } from "lucide-react";

import { getEquipo } from '../../../services/EquipoService';
import { getPlayerbyTeam } from '../../../services/PlayerService';
// import { data } from 'jquery';

const { Text } = Typography;
const { Search, TextArea } = Input;

function PlayerListPage() {
    const [equipoData, setEquipoData] = useState([]);
    const [playerData, setPlayerData] = useState([]); // Base de datos completa
    const [filteredData, setFilteredData] = useState([]); // Datos que se muestran (filtrados)
    const [isLoading, setIsLoading] = useState(true);
    // --- ESTADOS PARA MODALES SEPARADOS ---
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    //                                                        *****************************************************************
    // *******************************************************                               DATA                              *******************************************************                                                                 *
    //                                                        *****************************************************************
    ///////////  OBTENER DATA EQUIPOS ///////////
    const EquiposList = async () => {
        try {
            const response = await getEquipo();
            // const dataWithKeys = response.map(item => ({
            //     ...item,
            //     key: item.equipo_id
            // }));
            setEquipoData(response);
        }
        catch {
            Swal.fire("Error", "No se pudieron cargar los equipos", "error");
        } finally {
            setIsLoading(false);
        }
    };

    ///////////  OBTENER DATA PLAYER BY TEAM  ///////////
    const PlayerByTeamList = async (equipo_id) => {
        // Si no hay un ID de equipo seleccionado (por ejemplo, si limpian el Select), vaciamos la tabla
        if (!equipo_id) {
            setPlayerData([]);
            setFilteredData([]);
            return;
        }
        try {
            setIsLoading(true);
            const response = await getPlayerbyTeam(equipo_id);
            // Le pegamos el "sticker" (key) a cada jugador usando su player_id para Ant Design
            const dataWithKeys = response.map(item => ({
                ...item,
                key: item.player_id
            }));
            setPlayerData(dataWithKeys);
            setFilteredData(dataWithKeys);
        } catch {
            Swal.fire("Error", "No se pudieron cargar las vocalias", "error");
        } finally {
            setIsLoading(false);
        }
    };

    ///////////  FUNCION DE CAMBIO EN EL SELECT  ///////////
    const handleTeamChange = (value) => {
        // 'value' contiene el equipo_id que el usuario seleccionó en la interfaz
        // Llamamos a la función de búsqueda pasándole ese ID directamente
        PlayerByTeamList(value);
    };

    ///////////  FUNCION DE BUSQUEDA  ///////////
    const handleSearch = (value) => {
        const term = value.toLowerCase();
        console.log("term::", term);
        const filtered = playerData.filter(item =>
            item.name.toLowerCase().includes(term) ||
            item.last_name.toLowerCase().includes(term)
        );
        setFilteredData(filtered);
    };

    useEffect(() => {
        EquiposList();
        // PlayerByTeamList();
    }, []);

    const columns = [
        {
            title: 'CI',
            dataIndex: 'ci',
            key: 'ci',
        },
        {
            title: 'Apellidos / Nombres',
            dataIndex: 'nombre_completo',
            render: (_, record) => {
                // 'record' tiene todos los datos del jugador que viene de la API
                return `${record.last_name} ${record.name}`;
            },
        },
        {
            title: '# de camiseta',
            dataIndex: 'shirt_number',
            key: 'shirt_number',
        },
        {
            title: 'Posicion',
            dataIndex: 'player_position',
            key: 'player_position'
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
                    <h1 className="page-title">Gestión de Jugadores</h1>
                    <p className="page-subtitle">
                        Listado de jugadores activos en el presente campeonato
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
                        Nuevo Jugador
                    </Button>
                </div>
            </div>

            {/* Select de Equipos por id */}
            <div
                className="select-team-container"
                style={{
                    marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '350px', // Evita que se estire demasiado en pantallas gigantes
                    width: '100%' // Se adapta al 100% en pantallas móviles
                }}
            >
                <Text strong style={{ color: '#4a5568' }}>Filtrar por Equipo:</Text>
                <Select
                    showSearch
                    placeholder="Seleccione un equipo"
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    allowClear
                    onChange={handleTeamChange} // Ejecuta la función cada vez que el usuario escoge un equipo
                >
                    {equipoData.map(team => (
                        <Select.Option key={team.equipo_id} value={team.equipo_id}>
                            {team.nombre_completo}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            {/* DataTable */}
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
        </div>
    );
}

export default PlayerListPage;