import { useEffect, useRef } from "react";
import DataTableLib from "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "../../styles/StylesAdmin.css";

function DataTable({ children }) {
  const tableRef = useRef(null);
  const dtInstance = useRef(null);

  useEffect(() => {
    // Si la tabla ya existe en este nodo, la destruimos por completo
    if (dtInstance.current) {
      dtInstance.current.destroy(true);
      dtInstance.current = null;
    }

    // Inicialización con un pequeño retraso para asegurar que el DOM de React esté listo
    const timeout = setTimeout(() => {
      if (tableRef.current) {
        dtInstance.current = new DataTableLib(tableRef.current, {
          responsive: true,
          destroy: true, // Crucial: permite re-inicializar sobre el mismo elemento
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
          },
        });
      }
    }, 0);

    return () => {
      clearTimeout(timeout);
      if (dtInstance.current) {
        dtInstance.current.destroy(true);
        dtInstance.current = null;
      }
    };
  }, [children]); // Se dispara cada vez que la data de la tabla cambie

  return (
    <div className="table-container shadow-sm">
      <table 
        ref={tableRef} 
        className="display responsive nowrap admin-table" 
        style={{ width: "100%" }}
      >
        {children}
      </table>
    </div>
  );
}

export default DataTable;