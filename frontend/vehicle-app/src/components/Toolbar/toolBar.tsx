import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdLogout } from "react-icons/md";

type ToolBarProps = {
    toggleSidebar: () => void;
    toggleProfileMenu: () => void;
    isProfileMenuOpen: boolean;
};

const ToolBar = ({ toggleSidebar, toggleProfileMenu, isProfileMenuOpen }: ToolBarProps) => {
    return (
        <div className="tool-bar">
            <ToolBarIcon icon={<GiHamburgerMenu size="28" onClick={toggleSidebar} />} />
            <div className="relative">
                <UserProfile
                    text="Ime Prezime"
                    icon={<FaUserCircle size="25" />}
                    onClick={toggleProfileMenu}
                />
                {isProfileMenuOpen && (
                    <div className="absolute top-full right-0 w-44 bg-white shadow-md z-50">
                        <UserProfileOptions icon={<FaUserCircle size="22" />} text="Uredi profil" />
                        <UserProfileOptions icon={<MdLogout size="22" />} text="Odjava" />
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

const UserProfileOptions = ({ icon, text }: { icon: React.ReactElement, text: string }) => (

    <div className="option-profile">
        <div className="profile-icon">
            {icon}
        </div>
        {text}
    </div>
)

export default ToolBar;
