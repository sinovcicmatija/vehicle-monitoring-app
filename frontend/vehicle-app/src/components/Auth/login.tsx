import { useEffect, useState } from "react";
import { FaCarSide } from "react-icons/fa";
import type { LoginUserDTO } from "../Util/loginUserDTO";
import { loginUser } from "../../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import type { AuthResult } from "../Util/authResult";
import type { LoggedInUserDTO } from "../Util/loggedInUserDTO";
import NotificationModel from "../Util/Notification/notificationModel";

type LoginProps = {
    setUser: (user: LoggedInUserDTO) => void;
};

const Login = ({ setUser }: LoginProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notif, setNotif] = useState(location.state?.message || null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (notif) {
            const timer = setTimeout(() => setNotif(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notif]);


    async function handleLogin(event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (username.trim() === "" || password.trim() === "") {
            alert("Popunite sva polja.")
            return
        }

        const loginDTO: LoginUserDTO = {
            username,
            password
        };

        const response: AuthResult = await loginUser(loginDTO);
        if (response.success && response.user) {
            sessionStorage.setItem("user", JSON.stringify(response.user));
            setUser(response.user);
            navigate("/");
        } else {
            alert(response.message);
        }
    }

    function navigateToRegistration(): void {
        navigate("/registration");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {notif && <NotificationModel type="success" message={notif} />}
            <div className="bg-white rounded-xl shadow-xl p-10 w-80 flex flex-col items-center">
                <CompanyLogo icon={<FaCarSide size="32" className="m-3" />} text="CAR SCAN" />
                <form onSubmit={handleLogin} className="flex flex-col space-y-6">
                    <label className="flex flex-col text-sm">Korisničko ime
                        <input className="rounded-md p-2 border-2 border-solid" type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <label className="flex flex-col text-sm">Lozinka
                        <input className="rounded-md p-2 border-2 border-solid" type="text" name="password" onChange={(e) => setPassword(e.target.value)} />
                    </label>
                </form>
                <p className="text-sm cursor-pointer hover:underline mb-10 mt-4" onClick={navigateToRegistration}>Nemate račun? Registrirajte se.</p>
                <button className="bg-primary hover:bg-blue-700 px-6 py-2 rounded-lg text-white shadow-lg" onClick={handleLogin}>Prijava</button>
            </div>
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