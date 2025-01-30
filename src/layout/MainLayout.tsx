import Navbar from "@/components/navbar/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div>
            <header>
                <Navbar/>
            </header>
            <main className="mt-20">
                <Outlet />
            </main>
          
        </div>
    );
};

export default MainLayout;
