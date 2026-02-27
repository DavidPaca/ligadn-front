import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiRest from '../../services/ApiRest'; // Tu instancia de Axios
import '../../styles/Login.css';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await apiRest.post('/login', credentials);
            
            // Guardamos el token con el mismo nombre que usa el Interceptor
            localStorage.setItem('token_liga', response.data.data.token);
            // Guardamos datos del usuario para mostrar en el Navbar/Sidebar
            localStorage.setItem('user_info', JSON.stringify(response.data.data.user));

            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    {/* Puedes poner un logo aquí si tienes uno en assets */}
                    <h2>Liga Divino Niño</h2>
                    <p>Panel Administrativo</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="********"
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Cargando...' : 'Entrar al Sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;