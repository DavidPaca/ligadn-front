// import { useState } from "react";

function DashboardPage() {
    const stats = [
        { label: "Equipos", value: "24", color: "bg-blue-500" },
        { label: "Torneos Activos", value: "3", color: "bg-green-500" },
        { label: "Próximos Partidos", value: "12", color: "bg-amber-500" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Panel Administrativo</h1>
                <p className="text-slate-500">Bienvenido de nuevo al control de la liga.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 ${stat.color} rounded-full opacity-20`} />
                    </div>
                ))}
            </div>

            {/* Espacio para tablas o gráficos futuros */}
            <div className="bg-white h-96 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center border-dashed text-slate-400 font-medium">
                Gráficos y Actividad Reciente
            </div>
        </div>
    );
}

export default DashboardPage;