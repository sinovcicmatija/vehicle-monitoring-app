import { RiDashboard2Line } from "react-icons/ri";
import { GrStatusInfo } from "react-icons/gr";
import { TbTool } from "react-icons/tb";
import { FaCarSide } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

const SideBar = ({ isOpen }: {isOpen: boolean }) => {
    return (
        <div className={`side-bar ${isOpen ? "block" : "hidden"} md:block`}>
            <CompanyLogo icon={<FaCarSide size="32" className="m-3"/>} text="CAR SCAN"/>
            <SideBarIcon icon={<FaHome size="26" />} text="Home"/>
            <SideBarIcon icon={<RiDashboard2Line size="26" />} text="Live Dashboard"/>
            <SideBarIcon icon={<GrStatusInfo size="26" />} text="Car Status"/>
            <SideBarIcon icon={<TbTool size="26" />} text="Service History"/>
        </div>
    );
}

const SideBarIcon = ({ icon, text } : { icon: React.ReactElement, text: string }) => (
    <div className="sidebar-icon">
        <div className="sidebar-divider">
             {icon}
        </div>
        {text}
    </div>
);

const CompanyLogo = ({ icon, text } : { icon: React.ReactElement, text: string }) => (
    <div className="sidebar-logo">
        {icon}
        {text}
    </div>
);

export default SideBar;