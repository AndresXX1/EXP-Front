import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import LogIn from "@pages/LogIn";
import Home from "@pages/Home";
import Setting from "@pages/Setting";
import Notifications from "@pages/Notifications";
import EditContent from "@pages/EditContent";
import Products from "@pages/Prestamos";
import Users from "@pages/Users";
import DashBoard from "@components/DashBoard";
import ProtectedAuth from "@components/ProtectedAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { verifySessionAsync } from "@store/actions/auth";
import EditBanners from "@pages/EditContent/EditBanners";
import EditNotice from "@pages/EditContent/EditNotice";
import EditBranches from "@pages/EditContent/EditBranches";
import Sidebar from "@components/Sidebar";

const App = (): JSX.Element => {
  const { loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(verifySessionAsync({ dispatch }));
  }, []);

  if (loading) {
    return <div>cargando</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <Routes>
          <Route index element={<LogIn />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedAuth>
                <DashBoard />
              </ProtectedAuth>
            }
          >
            <Route index element={<Home />} />
            <Route path="users" element={<Users />} />
            <Route path="Products" element={<Products />} />
            <Route path="edit-content" element={<EditContent />} />
            <Route path="edit-content/banners" element={<EditBanners />} />
            <Route path="edit-content/notices" element={<EditNotice />} />
            <Route path="edit-content/branches" element={<EditBranches />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="setting" element={<Setting />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
