import { RootState } from "../features"
import { useAppSelector } from "../hooks/store"



export const Header = () => {

    const URL_BASE = import.meta.env.VITE_API_URL;

    const { user } = useAppSelector((state: RootState) => state.auth)
    const { photoUrl } = useAppSelector((state: RootState) => state.users);
    console.log("EL USUARIO ACTUAL ", photoUrl);

    return (
        <header >
           <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-5">
                <div className="flex items-center justify-between">

            <div className="text-md font-bold">
                <span className="font-light">Buenos días,
                </span> {user?.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase()) || "Invitado"}
            </div>

            <div className="p-0 ">
                <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full" src={photoUrl?`${photoUrl}`:"/"} alt="Foto de perfil" />
                    <div className="ml-3">
                       {user?.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase()) || ""}
                    </div>
                </div>
            </div>

          </div>
         </div>
      
            

        </header>
    )
}