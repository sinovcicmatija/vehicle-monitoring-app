import { FaCarSide } from "react-icons/fa";
import type { AuthResult } from "../Util/authResult";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { RegisterUserDTO } from "../Util/registerUserDTO";
import { registerUser } from "../../services/authService";
import Loader from "../Util/Loader/loaderModel";

const Registration = ({ }) => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleRegistration(event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (firstName.trim() === "" || lastName.trim() === "" || username.trim() === "" || email.trim() === "" || password.trim() === "") {
            alert("Popunite sva polja.")
            return
        }

        const regUser: RegisterUserDTO = {
            firstName,
            lastName,
            username,
            email,
            password
        };

        setIsLoading(true);
        const response: AuthResult = await registerUser(regUser);
        setIsLoading(false);
        if (response.success) {
            navigate("/login", {
                state: {message: "Registracija uspješna."}
            });
        } else {
            alert(response.message);
        }
    }

    function navigateToLogin(): void {
        navigate("/login");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {isLoading && <Loader fullScreen type="spinner" />}
            <div className="bg-white rounded-xl shadow-xl p-10 w-80 flex flex-col items-center">
                <CompanyLogo icon={<FaCarSide size="32" className="m-3" />} text="CAR SCAN" />
                <p className="text-sm cursor-pointer hover:underline mb-8 w-80 ml-20" onClick={navigateToLogin}>Natrag</p>
                <form onSubmit={handleRegistration} className="flex flex-col space-y-6">
                    <label className="flex flex-col text-sm">Ime
                        <input className="rounded-md p-2 border-2 border-solid" type="text" name="firstName" onChange={(e) => setFirstName(e.target.value)} />
                    </label>
                    <label className="flex flex-col text-sm">Prezime
                        <input className="rounded-md p-2 border-2 border-solid" type="text" name="lastName" onChange={(e) => setLastName(e.target.value)} />
                    </label>
                    <label className="flex flex-col text-sm">Korisničko ime
                        <input className="rounded-md p-2 border-2 border-solid" type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <label className="flex flex-col text-sm">Email
                        <input className="rounded-md p-2 border-2 border-solid" type="text" name="email" onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label className="flex flex-col text-sm">Lozinka
                        <input className="rounded-md p-2 border-2 border-solid mb-8" type="text" name="password" onChange={(e) => setPassword(e.target.value)} />
                    </label>
                </form>
                <button className="bg-primary hover:bg-blue-700 px-6 py-2 rounded-lg text-white shadow-lg disabled:opacity-50" 
                onClick={handleRegistration}>{isLoading ? "Registracija..." : "Registriraj se"}</button>
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


export default Registration;