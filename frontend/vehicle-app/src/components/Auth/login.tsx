import { FaCarSide } from "react-icons/fa";

const Login = ({}) => {
    return (
        <div className="">
        <CompanyLogo icon={<FaCarSide size="32" className="m-3" />} text="CAR SCAN" />
         <p className="flex items-center">Korisničko ime</p>
         <p className="flex items-center">Lozinka</p>
         <button>Prijava</button>
         </div>
    )

};

const CompanyLogo = ({ icon, text }: { icon: React.ReactElement, text: string }) => (
    <div className="sidebar-logo text-black">
        {icon}
        {text}
    </div>
);




export default Login;