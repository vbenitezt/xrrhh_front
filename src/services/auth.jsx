import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosGet, axiosPost } from "../apis/calls";
import { useAuthStore } from "../common/store/authStore";
import useNotification from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { useGlobalFilterStore } from "../common/store/globalFiltersStore";

const key = "auth";

export const useLoginMutate = () => {
  const { notify } = useNotification();
  const { setProfile, setToken } = useAuthStore();

  return useMutation({
    mutationFn: async (user) => {
      return await axiosPost(`${key}/login`, user);
    },
    onSuccess: ({user, token}) => {
      if (user && token) {
        setToken(token);
        setProfile(user);
        notify(
          `Bienvenid@ ${user.last_logout ? "nuevamente!" : ""}`,
          "success",
          user.desc_user
        );
      }
    }
  });
};


export const useLogoutMutate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const { resetGobalFilter } = useGlobalFilterStore();

  return useMutation({
    mutationFn: async () => {
      return await axiosGet(`${key}/logout`);
    },
    onSuccess: () => {
      navigate("/");
      logout();
      resetGobalFilter();
      queryClient.clear();
    },
  });
};
