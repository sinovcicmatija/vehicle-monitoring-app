import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdLogout } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import type { LoggedInUserDTO } from "../Util/loggedInUserDTO";

type ToolBarProps = {
    toggleSidebar: () => void;
    toggleProfileMenu: () => void;
    isProfileMenuOpen: boolean;
    onLogout: () => void;
    loggedInUser: LoggedInUserDTO;
};

const ToolBar = ({ toggleSidebar, toggleProfileMenu, isProfileMenuOpen, onLogout, loggedInUser }: ToolBarProps) => {
     const navigate = useNavigate();

     async function handleLogout() {
        sessionStorage.clear();
        onLogout();
        navigate("*");
    }
    
    return (
        <div className="tool-bar">
            <ToolBarIcon icon={<GiHamburgerMenu size="28" onClick={toggleSidebar} />} />
            <div className="relative">
                <UserProfile
                    text={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
                    icon={<FaUserCircle size="25" />}
                    onClick={toggleProfileMenu}
                />
                {isProfileMenuOpen && (
                    <div className="absolute top-full right-0 w-44 bg-white shadow-md z-50">
                        <UserProfileOptions icon={<LiaUserEditSolid size="22" />} text="Uredi profil" />
                        <UserProfileOptions onClick={handleLogout} icon={<MdLogout size="22" />} text="Odjava" />
                    </div>
                )}
            </div>
        </div>
    );
}

const ToolBarIcon = ({ icon }: { icon: React.ReactElement }) => (
    <div className="toolbar-icon">
        {icon}
    </div>
);

const UserProfile = ({ text, icon, onClick }: { text: string, icon: React.ReactElement, onClick: () => void }) => (
    <div className="user-profile" onClick={onClick}>
        {text}
        <div className="profile-icon">
            {icon}
        </div>
    </div>
)

const UserProfileOptions = ({ icon, text, onClick }: { icon: React.ReactElement, text: string, onClick?: () => void }) => (

    <div className="user-profile w-44" onClick={onClick}>
        <div className="profile-icon">
            {icon}
        </div>
        {text}
    </div>
)

export default ToolBar;
