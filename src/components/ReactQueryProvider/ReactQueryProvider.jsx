import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../common/store/authStore";
import useNotification from "../../hooks/useNotifications";



const ReactQueryProvider = ({ ...props }) => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const { notify } = useNotification();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false,
                staleTime: 30000,
                // placeholderData: keepPreviousData,
                throwOnError: ({ response }) => {
                    if (response?.status === 401) {
                        notify(
                            "Credenciales ínvalidas",
                            "error",
                            "Intente de nuevo!"
                        );
                        logout();
                        navigate("/");
                    } else if (response?.status === 409) {
                        notify("TENGO ESTO PENDIENTE!", "error");
                    } else if (response?.status === 410) {
                        notify(
                            "Su sesión ha caducado",
                            "error",
                            "Por favor ingrese de nuevo!"
                        );
                        logout();
                        navigate("/");
                    } /* else if (response.status === 500 && response.data?.detail) {
                        notify(
                            response.data?.detail || "Error de Servidor!",
                            "error",
                        );
                        navigate(-1);
                    } */
                }
            },
            mutations: {
                retry: false,
                onError: ({ response }) => {
                    if (response.status === 401) {
                        notify(
                            "Credenciales ínvalidas",
                            "error",
                            "Por favor intente de nuevo!",
                        );
                        logout();
                        navigate("/");
                    } else if (response.status === 409) {
                        notify("TENGO ESTO PENDIENTE!", "error");
                    } else if (response.status === 410) {
                        notify(
                            "Su sesión ha caducado",
                            "error",
                            "Por favor ingrese de nuevo!",
                        );
                        logout();
                        navigate("/");
                    }
                }
            },
        },
    });
    return (
        <QueryClientProvider client={queryClient} contextSharing={true}>
            {props.children}
        </QueryClientProvider>
    )
}


export default ReactQueryProvider;
