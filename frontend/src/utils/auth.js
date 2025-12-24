import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { clearUserData } from "../store/userSlice.js";

export async function logout(dispatch, navigate) {
  try {
    await axiosInstance.get("/api/auth/logout");
    dispatch(clearUserData());
    navigate("/", { replace: true });
  } catch (err) {
    console.error("Logout error:", err);
  }
}
