import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";


const ToolBar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    return (
        <div className="tool-bar">
            <ToolBarIcon icon={<GiHamburgerMenu size="28" onClick={toggleSidebar}/>}/>
            <UserProfile text="Ime Prezime" icon={<FaUserCircle size="25"/>}/>
        </div>
    );
}

const ToolBarIcon = ({ icon } : { icon: React.ReactElement }) => ( 
<div className="toolbar-icon"> 
    {icon} 
    </div> 
);

const UserProfile = ({ text, icon} : { text: string, icon: React.ReactElement }) => (
    <div className="user-profile">
    {text}
        <div className="profile-icon">
            {icon}
        </div>
    </div>
)


export default ToolBar;
