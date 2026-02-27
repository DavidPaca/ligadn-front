import PublicNavbar from "./PublicNavBar";
import { Outlet } from "react-router-dom";

function PublicLayout() {

    //                      *******************************************************
    //**********************                      Obtencion Data                   *********************/
    //                      *******************************************************

    return (
        <>
            {/* <PublicNavbar />
            <div style={{ padding: "20px" }}>
                <Outlet />
            </div> */}
            <PublicNavbar />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default PublicLayout;