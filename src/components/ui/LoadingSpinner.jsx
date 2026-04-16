import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingSpinner = ({ 
    message = "Cargando...", 
    size = "large", // puede ser 'small' o 'large'
    color = "#4f46e5" 
}) => {
    
    // Configuramos los tamaños dinámicamente
    const isSmall = size === 'small';
    const iconSize = isSmall ? 20 : 42;
    const padding = isSmall ? '10px 0' : '50px 0';
    const fontSize = isSmall ? '11px' : '13px';

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: padding, 
            gap: isSmall ? '6px' : '12px' 
        }}>
            <Spin 
                indicator={
                    <LoadingOutlined 
                        style={{ fontSize: iconSize, color: color }} 
                        spin 
                    />
                } 
            />
            {message && (
                <span style={{ 
                    color: '#94a3b8', 
                    fontSize: fontSize, 
                    letterSpacing: '0.5px' 
                }}>
                    {message}
                </span>
            )}
        </div>
    );
};

export default LoadingSpinner;