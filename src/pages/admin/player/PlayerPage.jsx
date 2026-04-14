import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Checkbox, Button, Card, Row, Col, Space } from 'antd';
import { UserPlus, Users, IdCard, Calendar, Trophy, Save, XCircle } from 'lucide-react';
import { getEquipo } from '../../../services/EquipoService';
import { createPlayer } from '../../../services/PlayerService';
import Swal from 'sweetalert2';
import '../../../styles/PlayerPage.css';

const { Option, OptGroup } = Select;

function PlayerPage() {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [equipos, setEquipos] = useState([]);

    /////////// CARGAR EQUIPOS ///////////
    useEffect(() => {
        const cargarEquipos = async () => {
            try {
                const data = await getEquipo();
                console.log("DATA EQUIPOS:", data);
                setEquipos(data || []);
            } catch (error) {
                console.error("Error cargando equipos", error);
            }
        };
        cargarEquipos();
    }, []);

    /////////// INSERCION DE JUGADOR ///////////
    const PlayerCreate = async (values) => {
        setIsLoading(true);
        try {
            await createPlayer(values);
            Swal.fire('¡Jugador Registrado!', 'El jugador ha sido registrado con éxito.', 'success');
            form.resetFields();
        }
        catch (error) {
            console.error("Error al registrar jugador:", error);
            // Extraemos el mensaje de error del backend si existe
            const mensajeError = error.response?.data?.mensaje || 'No se pudo registrar al jugador';
            Swal.fire({
                icon: 'error',
                title: 'Registro Duplicado',
                text: mensajeError,
                confirmButtonColor: '#ef4444'
            });
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div className="dashboard-header__titles">
                    <h1>Registro de Jugadores</h1>
                    <p>Inscribe nuevos deportistas en los equipos de la liga</p>
                </div>
            </header>

            <Card
                className="player-card"
                style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '16px' }}
                title={
                    <Space>
                        <UserPlus size={20} color="#10b981" />
                        <span style={{ fontSize: '18px', fontWeight: 700 }}>Datos del Jugador</span>
                    </Space>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={PlayerCreate}
                    initialValues={{ is_captain: false }}
                    autoComplete="off"
                    className="player-form"
                >
                    <Row gutter={[24, 0]}>
                        {/* Selección de Equipo */}
                        <Col span={24}>
                            <Form.Item
                                name="equipo_id"
                                label={<Space><Users size={16} /> Equipo al que pertenece</Space>}
                                rules={[{ required: true, message: 'Selecciona un equipo' }]}
                            >
                                <Select placeholder="Seleccione un equipo..." size="large">
                                    {equipos.map(eq => (
                                        <Option key={eq.equipo_id} value={eq.equipo_id}>
                                            {eq.nombre_completo}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* CI y Camiseta */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="ci"
                                // label={<Space><IdCard size={16} /> Cédula de Identidad</Space>}
                                label="Cédula de Identidad"
                                rules={[{ required: true, message: 'Ingresa la identificación' }]}
                            >
                                <Input placeholder="Ej: 1725..." size="large" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="shirt_number"
                                // label={<Space><Trophy size={16} /> Camiseta (Dorsal)</Space>}
                                label="Nº de Camiseta (Dorsal)"
                                rules={[{ required: true, message: 'Requerido' }]}
                            >
                                <InputNumber min={0} max={99} style={{ width: '100%' }} size="large" placeholder="0-99" />
                            </Form.Item>
                        </Col>

                        {/* Nombres y Apellidos */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="name"
                                label="Nombres"
                                rules={[{ required: true, message: 'Ingresa los nombres' }]}
                            >
                                <Input size="large" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="last_name"
                                label="Apellidos"
                                rules={[{ required: true, message: 'Ingresa los apellidos' }]}
                            >
                                <Input size="large" />
                            </Form.Item>
                        </Col>

                        {/* Fecha y Posición */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="birthdate"
                                label={<Space><Calendar size={16} /> Fecha de Nacimiento</Space>}
                                rules={[{ required: true, message: 'Selecciona la fecha' }]}
                            >
                                <DatePicker style={{ width: '100%' }} size="large" placeholder="dd/mm/aaaa" format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="player_position"
                                label="Posición en el campo"
                                rules={[{ required: true, message: 'Selecciona una posición' }]}
                            >
                                <Select
                                    placeholder="Seleccione posición específica..."
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    <OptGroup label="Portería">
                                        <Option value="POR">Portero</Option>
                                    </OptGroup>

                                    <OptGroup label="Defensa">
                                        <Option value="DFC">Defensa Central</Option>
                                        <Option value="LTD">Lateral Derecho</Option>
                                        <Option value="LTI">Lateral Izquierdo</Option>
                                        <Option value="LIB">Líbero / Carrilero</Option>
                                    </OptGroup>

                                    <OptGroup label="Mediocampo">
                                        <Option value="MCD">Mediocentro Defensivo (Pivote)</Option>
                                        <Option value="MC">Mediocentro Organizador</Option>
                                        <Option value="MCO">Mediapunta (Creativo)</Option>
                                        <Option value="MD">Interior Derecho</Option>
                                        <Option value="MI">Interior Izquierdo</Option>
                                    </OptGroup>

                                    <OptGroup label="Delantera">
                                        <Option value="ED">Extremo Derecho</Option>
                                        <Option value="EI">Extremo Izquierdo</Option>
                                        <Option value="DC">Delantero Centro (9)</Option>
                                        <Option value="SD">Segundo Delantero</Option>
                                    </OptGroup>
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Checkbox Capitán */}
                        <Col span={24} style={{ textAlign: 'center', margin: '20px 0' }}>
                            <Form.Item name="is_captain" valuePropName="checked">
                                <Checkbox className="custom-checkbox">
                                    <span style={{ fontWeight: 600, color: '#475569' }}>¿Es el capitán del equipo?</span>
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Acciones */}
                    <div className="form-actions-antd">
                        <Space>
                            <Button
                                size="large"
                                icon={<XCircle size={18} />}
                                onClick={() => window.history.back()}
                                className="btn-ant-secondary"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                loading={isLoading}
                                icon={!isLoading && <Save size={18} />}
                                className="btn-ant-primary"
                            >
                                Guardar Jugador
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default PlayerPage;