//import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { loginUser } from "../../features/user/authThunk";
import { loadUserSession } from "../../features/user/userThunk";
import { Axios, AxiosError } from "axios";

//import { logout, setToken } from "../../features/user/authSlice";

//import { loginUser, setRoles, setToken, setUser } from "../../features/user/authSlice";




export function Login() {

    const dispatch = useAppDispatch();

    const { accessToken, error } = useAppSelector((state) => state.auth);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const location = useLocation();

    const from = location.state?.from?.pathname || "/";



    useEffect(() => {
        if (accessToken) {
            navigate(from, { replace: true });
        }
    }, [accessToken, from, navigate])


    useEffect(() => {

    }, [])



    const handleLogin = async (e: React.FormEvent) => {

        e.preventDefault();
        try {
            const result = await dispatch(loginUser({ username, password })).unwrap();
            const photo = await dispatch(loadUserSession({ username: username }))
            console.log("Login exitoso:", result, photo);
            navigate('/', { replace: true });


        } catch (err) {
            if (err instanceof AxiosError) {
                console.error("Error al iniciar sesión:", err.response?.data?.message || err.message);
            } else {
                console.error("Error inesperado al iniciar sesión:", err);
            }
        }


    }

    return (

        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="./src/assets/logo_fich.svg?color=indigo&shade=600" alt="Logo Fich" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sistema Administración Puntos Docentes</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleLogin} >
                    {error && <div className="w-full rounded-md border border-red-300 bg-red-100 px-4 py-4 text-center">
                        <p className="font-semibold text-red-500">{error}</p>
                    </div>}


                    <div>
                        <label className="block text-sm/6 font-medium text-gray-900" htmlFor="username">Usuario:</label>


                        <div>
                            <input
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                id="username"
                                type="text"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                placeholder="&#xf007; username"
                                autoComplete="true"
                            />
                        </div>

                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm/6 font-medium text-gray-900" htmlFor="password">Password:</label>



                        </div>
                        <div className="mt-2">
                            <input
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="&#xf023; password"
                                autoComplete="true"
                            />
                        </div>

                    </div>


                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-base font-semibold text-white shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                    >Iniciar Sesion</button>
                </form>
            </div>

        </div>
    )

}
