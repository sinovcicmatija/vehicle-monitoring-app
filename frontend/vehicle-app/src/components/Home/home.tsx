import type { LoggedInUserDTO } from "../Util/loggedInUserDTO";

const Home = ({loggedInUser}: {loggedInUser: LoggedInUserDTO}) => {

    return (
        <>
        <h1 className="font-semibold m-3 text-xl">Dobrodošli natrag, {loggedInUser.username}</h1>
        <div className="flex flex-row">
            <div className="card-content">
         <h1 className="flex items-center">Info o autu</h1>
         </div>

         <div className="card-content">
         <h1 className="flex items-center">Slika</h1>
         </div>
        </div>

        
         </>
    )

};


export default Home;