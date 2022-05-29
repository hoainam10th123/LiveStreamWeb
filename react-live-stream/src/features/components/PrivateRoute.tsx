import { useStore } from "../../stores/stores";
import Login from "../login/Login";


export default function PrivateWrapper({ children }: { children: JSX.Element }) {
    const { userStore: { isLoggedIn } } = useStore();
    return isLoggedIn ? children : <Login />;
    //return isLoggedIn ? children : <Navigate to="/" replace />;
};