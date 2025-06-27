import { RiDashboard2Line } from "react-icons/ri";
import { GrStatusInfo } from "react-icons/gr";
import { TbTool } from "react-icons/tb";
import { FaCarSide } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const SideBar = ({ isOpen }: { isOpen: boolean }) => {
    return (
        <div className={`side-bar ${isOpen ? "block" : "hidden"} md:block`}>
            <CompanyLogo icon={<FaCarSide size="32" className="m-3" />} text="CAR SCAN" />
            <SideBarIcon icon={<FaHome size="26" />} text="Početna" route="/" />
            <SideBarIcon icon={<RiDashboard2Line size="26" />} text="Nadzorna ploča" route="/dashboard" />
            <SideBarIcon icon={<GrStatusInfo size="26" />} text="Status auta" route="/status" />
            <SideBarIcon icon={<TbTool size="26" />} text="Servisna povijest" route="/history" />
        </div>
    );
}

const SideBarIcon = ({ icon, text, route }: { icon: React.ReactElement, text: string, route: string }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname === route;

    return (
        <div className={`sidebar-icon ${isActive ? 'font-bold text-white' : ''}`} onClick={() => navigate(route)}>
            <div className={`sidebar-divider ${isActive ? 'font-bold text-white' : ''}`}>
                {icon}
            </div>
            {text}
        </div>
    );
};

const CompanyLogo = ({ icon, text }: { icon: React.ReactElement, text: string }) => (
    <div className="sidebar-logo">
        {icon}
        {text}
    </div>
);

export default SideBar;