import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Saved from "./pages/Saved";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/saved"
            element={<Saved />}
          />

        </Route>

        <Route
          path="/404"
          element={<NotFound />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/404"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;