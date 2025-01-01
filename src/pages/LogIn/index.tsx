import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { logInAsync } from "@store/actions/auth";
import { Navigate } from "react-router-dom";
import { IconEyes, IconEyesOff } from "@utils/svg";

const LogIn = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const dispatch = useDispatch<AppDispatch>();
  const { authenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (data.email === "" || data.password === "") {
      if (data.email === "") {
        setError("Introduce un Correo electrónico.");
      }
      if (data.password === "") {
        setError(prevState =>
          prevState
            ? (prevState = prevState + " " + "Introduce una Contraseña.")
            : (prevState = "Introduce una Contraseña.")
        );
      }
      return;
    }

    setActive(true);

    dispatch(logInAsync({ data, setActive, setError, dispatch }))
      .then(response => {
        if (response.payload) {
          console.log("Token recibido:", response.payload);
        } else {
          console.warn("No se encontró el token en la respuesta:", response);
        }
      })
      .catch(error => {
        console.error("Error en la autenticación:", error);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  if (authenticated && !loading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex w-full flex-row max-h-[110vh] bg-white">
      <figcaption className="overflow-hidden w-[50%]">
        <img className="object-center" src="login/image_login.png"></img>
      </figcaption>
      <div className="pt-[60px] mx-auto max-w-[560px]">
        <img className="mb-[25px] object-center" src="login/logo.svg" alt="" />
        <h2 className="text-expresscash-textos text-[44px] font-poppins leading-[48px] tracking-[-0.96px] mb-[13px] mx-auto">
          ¡Bienvenido de vuelta!
        </h2>
        <p className="text-expresscash-textos text-[23px] font-poppins mb-[32px]">
          Iniciá sesión para poder acceder al panel de administración.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              className="w-[560px] rounded-[8px] text-[19px] mb-[24px] h-[60px] px-[22px] border-1 border-expresscash-gray text-expresscash-gray font-poppins leading-[19px] placeholder:text-expresscash-gray"
              type="text"
              placeholder="Email o alias"
              onChange={handleChange}
              value={data.email}
              name="email"
            />
            <div className="relative">
              <input
                className="w-[560px] rounded-[8px] mb-[24px] text-[19px] h-[60px] px-[22px] border-1 border-expresscash-gray text-expresscash-gray font-poppins leading-[19px] placeholder:text-expresscash-gray"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                onChange={handleChange}
                value={data.password}
                name="password"
              />
              <div
                className="absolute right-16 top-6 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IconEyesOff /> : <IconEyes />}
              </div>
            </div>
          </div>

          {error ? (
            <p className="text-red-500 text-sm text-wrap text-center max-h-5 px-2 mb-2">
              {Array.isArray(error) ? error.join(" ") : error}
            </p>
          ) : (
            <div className="w-full h-0"></div>
          )}
          <div className="flex justify-between max-w-[560px] mb-10">
            <div className="flex flex-row gap-3 items-center">
              <input
                className="rounded-[3px] focus:border-0 selection:border-0 text-expresscash-skyBlue"
                type="checkbox"
              />
              <p className="text-expresscash-textos text-[16px] font-poppins leading-[125%]">
                Recordarme
              </p>
            </div>
            <p className="text-expresscash-skyBlue text-[16px] font-poppins leading-[125%]"></p>
          </div>
          <button
            className="w-[560px] bg-expresscash-skyBlue h-[52px] text-white text-[19px] font-norma leading-[19px] disabled:bg-expresscash-gray rounded-[8px]"
            type="submit"
            disabled={active}
          >
            Iniciar sesion
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
