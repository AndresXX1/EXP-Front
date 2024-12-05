import { RootState } from "@store";
import { getData } from "@store/services/admin";
import { capitalizeFirstLetter, getFormattedDate } from "@utils/format";
import {
  ArrowLeft,
  IconArrows,
  IconBuy,
  IconDollar,
  IconDownload,
  IconIncrease,
  IconLower,
  IconMagnifyingGlass,
  IconScreen,
  IconStarts,
  Iconstatistics,
  IconSuscriber,
  IconTime,
  IconUser,
  IconUserMore,
  LineHome,
} from "@utils/svg";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatSecondsToMinutes } from "../../utils/format";

type Props = {
  state: boolean;
  text?: string;
  fontSize?: string;
  iconClassName?: string;
};

type IDataDashboard = {
  usage_time: {
    last_week: number;
    these_week: number;
  };
  active_users: {
    these_week: number;
  };
  age: {
    age18_30: number;
    age31_45: number;
    age46_60: number;
    age61_over: number;
    total: number;
  };
  gender: {
    female: number;
    male: number;
  };
  created_users: number[];
  timers: {
    last_week: {
      home: number;
      cuponizate: number;
      argencompras: number;
      profile: number;
    };
    these_week: {
      home: number;
      cuponizate: number;
      argencompras: number;
      profile: number;
    };
  };
};

const Home = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<IDataDashboard | null>(null);

  const getDataApi = async () => {
    const response = await getData();
    if (response) {
      setData(response);
    }
  };
  const IconSelector: React.FC<Props> = ({ state, iconClassName }) => {
    const iconClass = iconClassName || "";

    return state ? (
      <IconIncrease className={iconClass} />
    ) : (
      <IconLower className={iconClass} />
    );
  };
  const ColorfulText: React.FC<Props> = ({
    state,
    text,
    fontSize = "22px",
  }) => {
    return (
      <p
        className="text-[22px] font-book"
        style={{ color: state ? "#05B922" : "#ED1A00", fontSize: fontSize }}
      >
        {text}
      </p>
    );
  };
  const date = [
    {
      info: "Mayo 1/4",
    },
    {
      info: "Mayo 2/4",
    },
    {
      info: "Mayo 3/4",
    },
    {
      info: "Mayo 4/4",
    },
    {
      info: "Julio 1/4",
    },
    {
      info: "Julio 2/4",
    },
    {
      info: "Julio 3/4",
    },
    {
      info: "Julio 4/4",
    },
  ];

  useEffect(() => {
    getDataApi();
  }, []);

  const progress_18_30 =
    data?.age.age18_30 && data?.age.total
      ? (data?.age.age18_30 / data?.age.total) * 100
      : 0;
  const progress_30_45 =
    data?.age.age31_45 && data?.age.total
      ? (data?.age.age31_45 / data?.age.total) * 100
      : 0;
  const progress_45_60 =
    data?.age.age46_60 && data?.age.total
      ? (data?.age.age46_60 / data?.age.total) * 100
      : 0;
  const progress_60_over =
    data?.age.age61_over && data?.age.total
      ? (data?.age.age61_over / data?.age.total) * 100
      : 0;

  const viewTop = data
    ? Object.entries(data?.timers?.these_week).sort((a, b) => b[1] - a[1])
    : [];

  const totalSeconds = data
    ? Object.values(data?.timers?.these_week).reduce(
        (total, value) => total + value,
        0
      )
    : 0;

  return (
    <div className="flex flex-col pl-16 pt-12 px-10 h-[100%]">
      <p className="text-[46.08px] text-expresscash-textos font-bold">
        Hola{" "}
        <span className="text-expresscash-skyBlue">
          {user?.full_name || "Usuario"}
        </span>
      </p>
      <p className="text-[19.2px] text-expresscash-gray font-book">
        ¡Bienvenido de vuelta!
      </p>

      <div className="flex gap-5 pt-5">
        <div className="relative">
          <input
            className="w-[457px] h-[54px] rounded-[13px] border-[1px] border-expresscash-textos border-solid px-10 placeholder:text-expresscash-textos font-book text-expresscash-textos text-[15.36px]"
            type="search"
            placeholder="Buscar estadísticas o datos"
          />
          <IconMagnifyingGlass className="absolute top-[18px] left-4" />
        </div>
        <div className="flex w-[127px] h-[54px] ml-4 border-[1px] border-expresscash-textos flex- items-center justify-center gap-2 rounded-[13px]">
          <p className="text-[15.36px] font-book text-expresscash-textos">
            Semanal
          </p>
          <ArrowLeft className="w-[7px] h-[20px] rotate-[270deg]" />
        </div>
        <button className="flex gap-2 w-[291px] h-[54px] items-center justify-center bg-expresscash-skyBlue text-[1rem] text-expresscash-white font-book rounded-[13px] hover:bg-expresscash-blue hover:transition-colors duration-100">
          <IconDownload />
          Descargar planillla
        </button>
      </div>
      <p className="flex items-center gap-[6px] pt-5 text-expresscash-gray text-[15.36px] font-book">
        {" "}
        <div className="w-[10.56px] h-[10.56px] bg-expresscash-green rounded-full bg-opacity-[0.7]"></div>
        {getFormattedDate()}
        <IconArrows />
      </p>

      <div className="grid grid-cols-3 grid-rows-5 gap-5 pt-5 pb-10">
        <div className="border-[1px] border-expresscash-gray col-span-1 h-[207px] rounded-[13px] px-5 py-5">
          <div className="flex gap-3 items-center pb-5">
            <IconUser color="#C4C4C4" />
            <p className="text-[22px] font-bold text-expresscash-textos">
              Usuarios activos
            </p>
          </div>

          <p className="text-[46.08px] font-bold text-expresscash-textos mb-4">
            {data?.active_users.these_week}
          </p>

          <div className="flex gap-2 items-center">
            <IconSelector state={true} />
            <ColorfulText state={true} text="+12%" />

            <p className="text-[22px] text-expresscash-gray2 font-book">
              esta semana
            </p>
          </div>
        </div>
        <div className="border-[1px] border-expresscash-gray col-span-1 h-[207px] rounded-[13px] px-5 py-5">
          <div className="flex gap-3 items-center pb-5">
            <IconTime />
            <p className="text-[22px] font-bold text-expresscash-textos">
              Tiempo de uso
            </p>
          </div>
          <p className="text-[46.08px] font-bold text-expresscash-textos mb-4">
            01:42s
          </p>

          <div className="flex gap-2 items-center">
            <IconSelector state={false} />
            <ColorfulText state={false} text="+11%" />
            <p className="text-[22px] text-expresscash-gray2 font-book">
              esta semana
            </p>
          </div>
        </div>
        <div className="border-[1px] border-expresscash-gray col-span-1 h-[207px] rounded-[13px] px-5 py-5">
          <div className="flex gap-3 items-center pb-5">
            <IconSuscriber />
            <p className="text-[22px] font-bold text-expresscash-textos">
              Tasa de abandono
            </p>
          </div>
          <p className="text-[46.08px] font-bold text-expresscash-textos mb-4">
            5%
          </p>

          <div className="flex gap-2 items-center">
            <IconSelector state={false} />
            <ColorfulText state={false} text="-1%" />
            <p className="text-[22px] text-expresscash-gray2 font-book">
              esta semana
            </p>
          </div>
        </div>
        <div className="border-[1px] border-expresscash-gray col-span-2 h-[207px] rounded-[13px] p-4">
          <div className="flex gap-3 items-center pb-5">
            <IconUserMore />

            <p className="text-[22px] font-bold text-expresscash-textos">
              Cantidad de usuarios
            </p>
            <IconSelector state={true} />
            <ColorfulText state={true} text="+4%" />
          </div>
          <div className="flex gap-5">
            <div className="flex flex-col gap-[13px]">
              <p className="text-expresscash-gray2 text-[9.6px] font-book">
                200k
              </p>
              <p className="text-expresscash-gray2 text-[9.6px] font-book">
                150k
              </p>
              <p className="text-expresscash-gray2 text-[9.6px] font-book">
                100k
              </p>
              <p className="text-expresscash-gray2 text-[9.6px] font-book">
                50k
              </p>
            </div>
            <div className="grid grid-cols-8 grid-rows-3 w-[90%] relative">
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <div className="border-[1px] h-[33px]"></div>
              <LineHome className="absolute top-9" />
              <div className="absolute bg-expresscash-blue w-[7.68px] h-[7.68px] rounded-[4px] top-[2.1rem] right-[16.25rem]"></div>
            </div>
          </div>
          <div className="px-[22px] pt-3 flex gap-7">
            {date.map((inf, key) => (
              <div className="flex" key={key}>
                <p className="text-[9.6px] text-expresscash-textos font-book">
                  {inf.info}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-[1px] border-expresscash-gray row-span-2 h-[435px] rounded-[13px] p-5">
          <div className="flex gap-3 items-center pb-3">
            <Iconstatistics />

            <p className="text-[22px] font-bold text-expresscash-textos">
              Estadísticas
            </p>
          </div>
          <p className="text-[20px] text-expresscash-textos font-book">Edad</p>
          <div className="flex gap-[22px] items-center">
            <p className="text-[15.36px] font-book text-expresscash-gray2">
              18-30
            </p>
            <div
              className="bg-expresscash-skyBlue rounded-[4.9px] h-[13.44px]"
              style={{
                width: `${Math.round(progress_18_30)}%`,
              }}
            ></div>
            <p className="text-expresscash-textos text-[15.36px] font-book">
              {progress_18_30}%
            </p>
          </div>
          <div className="flex gap-[18px] items-center">
            <p className="text-[15.36px] font-book text-expresscash-gray2">
              30-45
            </p>
            <div
              className="bg-expresscash-skyBlue rounded-[4.9px] h-[13.44px]"
              style={{
                width: `${Math.round(progress_30_45)}%`,
              }}
            ></div>
            <p className="text-expresscash-textos text-[15.36px] font-book">
              {progress_30_45}%
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-[15.36px] font-book text-expresscash-gray2">
              45-60
            </p>
            <div
              className="bg-expresscash-skyBlue rounded-[4.9px] h-[13.44px]"
              style={{
                width: `${Math.round(progress_45_60)}%`,
              }}
            ></div>
            <p className="text-expresscash-textos text-[15.36px] font-book">
              {progress_45_60}%
            </p>
          </div>
          <div className="flex gap-8 items-center">
            <p className="text-[15.36px] font-book text-expresscash-gray2">{`>60     `}</p>
            <div
              className="bg-expresscash-skyBlue rounded-[4.9px] h-[13.44px]"
              style={{
                width: `${Math.round(progress_60_over)}%`,
              }}
            ></div>
            <p className="text-expresscash-textos text-[15.36px] font-book">
              {progress_60_over}%
            </p>
          </div>
          <p className="text-[20px] text-expresscash-textos font-book pt-3">
            Género
          </p>
          <div className="flex flex-row mt-3">
            <div className="flex w-[60%] gap-2">
              <p className="text-expresscash-textos text-[15.36px] font-book">
                H
              </p>
              <div className="bg-expresscash-blue w-[80%] h-[25px] text-[11.52px] flex items-center px-2 font-book text-expresscash-white rounded-s-lg">
                44%
              </div>
            </div>
            <div className="flex w-[60%] gap-2">
              <div className="bg-expresscash-skyBlue w-[100%] h-[25px] text-[11.52px] flex items-center px-2 font-book text-expresscash-white rounded-e-lg">
                56%
              </div>
              <p className="text-expresscash-textos text-[15.36px] font-book">
                M
              </p>
            </div>
          </div>
          {/* <p className="text-[20px] text-expresscash-textos font-book pt-3 pb-3">
            Ubicación
          </p>
          <div className="flex gap-5 justify-center relative">
            <svg
              className="absolute top-8"
              xmlns="http://www.w3.org/2000/svg"
              width="238"
              height="18"
              viewBox="0 0 238 18"
              fill="none"
            >
              <path
                d="M229.989 17.909C229.895 17.9096 229.801 17.8916 229.714 17.856C229.627 17.8205 229.548 17.7681 229.482 17.7019C229.415 17.6355 229.361 17.5565 229.325 17.4695C229.289 17.3824 229.27 17.2891 229.27 17.1948C229.27 17.1005 229.289 17.0071 229.325 16.9201C229.361 16.833 229.415 16.7541 229.482 16.6877L235.317 10.8521C235.718 10.4503 235.944 9.90567 235.944 9.33782C235.944 8.76998 235.718 8.22535 235.317 7.82357L229.482 1.98799C229.347 1.85349 229.271 1.67107 229.271 1.48086C229.271 1.29065 229.347 1.10823 229.482 0.973732C229.616 0.839233 229.798 0.763672 229.989 0.763672C230.179 0.763672 230.361 0.839233 230.496 0.973732L236.331 6.80931C236.664 7.14106 236.928 7.53516 237.108 7.96904C237.288 8.40293 237.381 8.86807 237.381 9.33782C237.381 9.80758 237.288 10.2727 237.108 10.7066C236.928 11.1405 236.664 11.5346 236.331 11.8663L230.496 17.7019C230.429 17.7681 230.35 17.8205 230.263 17.856C230.176 17.8916 230.083 17.9096 229.989 17.909Z"
                fill="#575757"
              />
              <path
                d="M7.7518 0.758919C7.84581 0.758375 7.93899 0.776392 8.02602 0.811937C8.11304 0.847483 8.1922 0.899858 8.25894 0.966057C8.32588 1.03246 8.37902 1.11146 8.41528 1.1985C8.45155 1.28554 8.47022 1.3789 8.47022 1.47319C8.47022 1.56748 8.45155 1.66084 8.41528 1.74788C8.37902 1.83492 8.32588 1.91392 8.25894 1.98032L2.42335 7.8159C2.02207 8.21767 1.79668 8.7623 1.79668 9.33015C1.79668 9.89799 2.02207 10.4426 2.42335 10.8444L8.25894 16.68C8.39343 16.8145 8.469 16.9969 8.469 17.1871C8.469 17.3773 8.39343 17.5597 8.25894 17.6942C8.12444 17.8287 7.94201 17.9043 7.7518 17.9043C7.56159 17.9043 7.37917 17.8287 7.24467 17.6942L1.40909 11.8587C1.0765 11.5269 0.812629 11.1328 0.632587 10.6989C0.452545 10.265 0.35987 9.7999 0.35987 9.33015C0.35987 8.86039 0.452545 8.39525 0.632587 7.96137C0.812629 7.52748 1.0765 7.13338 1.40909 6.80163L7.24467 0.966057C7.31141 0.899858 7.39057 0.847483 7.47759 0.811937C7.56462 0.776392 7.6578 0.758375 7.7518 0.758919Z"
                fill="#C4C4C4"
              />
            </svg>
            <div className="flex flex-col justify-end items-center">
              <div className="w-[13px] bg-expresscash-skyBlue rounded-[4.9px] h-[50px]"></div>
              <p className="text-[9.6px] font-book text-expresscash-textos mt-1">
                AMBA
              </p>

              <p className="text-expresscash-textos text-[15.36px] font-book">
                52%
              </p>
            </div>
            <div className="flex flex-col items-center justify-end">
              <div className="h-[40%] w-[13px] bg-expresscash-skyBlue rounded-[4.9px]"></div>
              <p className="text-[9.6px] font-book text-expresscash-textos mt-1">
                CABA
              </p>
              <p className="text-expresscash-textos text-[15.36px] font-book">
                16%
              </p>
            </div>
            <div className="flex flex-col justify-end items-center">
              <div className="h-[25%] w-[13px] bg-expresscash-skyBlue rounded-[4.9px]"></div>
              <p className="text-[9.6px] font-book text-expresscash-textos mt-1">
                Bs As.
              </p>
              <p className="text-expresscash-textos text-[15.36px] font-book">
                53%
              </p>
            </div>
            <div className="flex flex-col justify-end items-center">
              <div className="h-[20%] w-[13px] bg-expresscash-skyBlue rounded-[4.9px]"></div>
              <p className="text-[9.6px] font-book text-expresscash-textos mt-1">
                Jujuy
              </p>
              <p className="text-expresscash-textos text-[15.36px] font-book">
                21%
              </p>
            </div>
          </div> */}
        </div>
        <div className="border-[1px] border-expresscash-gray col-span-2 h-[207px] rounded-[13px] p-4">
          <div className="flex gap-3 items-center pb-5">
            <IconScreen />

            <p className="text-[22px] font-bold text-expresscash-textos">
              Estadísticas de cada pantalla
            </p>
            <div className="flex w-[179px] h-[28px] ml-4 border-[1px] border-expresscash-textos flex- items-center justify-center gap-2 rounded-[8px]">
              <p className="text-[15.36px] font-book text-expresscash-textos">
                Tiempo promedio
              </p>
              <ArrowLeft className="w-[6px] h-[11.52px] rotate-[270deg] mt-1" />
            </div>
          </div>
          {viewTop.map((item, key) => {
            const previousValue = viewTop[key + 1] ? viewTop[key + 1][1] : null; // Valor de la semana pasada
            const currentValue = item[1]; // Valor de esta semana

            let changeText = "";

            if (previousValue !== null) {
              // Verificamos si el valor anterior es 0
              if (previousValue === 0) {
                // Si el valor anterior es 0 y el actual es mayor, consideramos que es un aumento del 100%
                changeText = currentValue > 0 ? "+100%" : "0%";
              } else {
                // Cálculo del cambio porcentual
                const percentageChange = Math.round(
                  ((previousValue - currentValue) / previousValue) * 100
                );

                // Generar el texto de cambio
                if (percentageChange < 0) {
                  changeText = `${Math.abs(percentageChange)}%`; // Crecimiento
                } else {
                  changeText = `${percentageChange}%`; // Decrecimiento
                }
              }
            } else {
              changeText = "0%"; // Si no hay valor anterior
            }
            return (
              <div className="flex items-center gap-1" key={`${key}=view`}>
                <p className="text-[9.6px] text-expresscash-textos font-bold">
                  {`#0${key + 1}`}
                </p>
                <p className="text-[9.6px] text-expresscash-textos font-book mb-1 pr-14">
                  {capitalizeFirstLetter(item[0])}
                </p>
                <div
                  className={`h-[13.44px] rounded-[4.8px] mr-2 ${
                    item[0] === "home"
                      ? "bg-expresscash-skyBlue"
                      : item[0] === "profile"
                        ? "bg-[#F3E670]"
                        : item[0] === "argencompras"
                          ? "bg-[#F47666]"
                          : "bg-[#AE81F4]"
                  }`}
                  style={{
                    width: `${(item[1] / totalSeconds) * 100}%`,
                  }}
                ></div>
                <p className="text-[15.36px] mr-1 font-bold text-expresscash-textos">
                  {`${formatSecondsToMinutes(item[1])}`}
                </p>
                <IconSelector
                  iconClassName="w-[9.6px]"
                  state={viewTop[key + 1] && item[1] > viewTop[key + 1][1]}
                />
                <ColorfulText
                  state={viewTop[key + 1] && item[1] > viewTop[key + 1][1]}
                  text={`${viewTop[key + 1] && item[1] > viewTop[key + 1][1] ? "+" : "-"} ${changeText}%`}
                  fontSize="9.6px"
                />
                <p className="text-[9.6px] ml-1 text-expresscash-gray2 font-book">
                  esta semana
                </p>
              </div>
            );
          })}
        </div>
        <div className="border-[1px] border-expresscash-gray col-span-1 h-[207px] rounded-[13px] px-5 py-5">
          <div className="flex gap-3 items-center pb-5">
            <IconDollar />
            <p className="text-[22px] font-bold text-expresscash-textos">
              Préstamos
            </p>
          </div>
          <p className="text-[46.08px] font-bold text-expresscash-textos mb-4">
            $11m
            <span className="text-[22px] font-book text-expresscash-textos ml-2">
              solicitados
            </span>
          </p>

          <div className="flex gap-2 items-center">
            <IconSelector state={true} />
            <ColorfulText state={true} text="+9%" />
            <p className="text-[22px] text-expresscash-gray2 font-book">
              esta semana
            </p>
          </div>
        </div>
        <div className="border-[1px] border-expresscash-gray col-span-1 h-[207px] rounded-[13px] px-5 py-5">
          <div className="flex gap-3 items-center pb-5">
            <IconBuy />
            <p className="text-[22px] font-bold text-expresscash-textos">
              ArgenCompras
            </p>
          </div>
          <p className="text-[46.08px] font-bold text-expresscash-textos mb-4">
            $2.6m
            <span className="text-[22px] font-book text-expresscash-textos ml-2">
              gastado
            </span>
          </p>

          <div className="flex gap-2 items-center">
            <IconSelector state={true} />
            <ColorfulText state={true} text="+7%" />
            <p className="text-[22px] text-expresscash-gray2 font-book">
              esta semana
            </p>
          </div>
        </div>
        <div className="border-[1px] border-expresscash-gray col-span-1 h-[207px] rounded-[13px] px-5 py-5">
          <div className="flex gap-3 items-center pb-5">
            <IconStarts />
            <p className="text-[22px] font-bold text-expresscash-textos">
              Puntos expresscash
            </p>
          </div>
          <p className="text-[46.08px] font-bold text-expresscash-textos mb-4">
            22.8k
            <span className="text-[22px] font-book text-expresscash-textos ml-2">
              canjeados
            </span>
          </p>

          <div className="flex gap-2 items-center">
            <IconSelector state={true} />
            <ColorfulText state={true} text="+2%" />
            <p className="text-[22px] text-expresscash-gray2 font-book">
              esta semana
            </p>
          </div>
        </div>
        <div className="border-[1px] border-expresscash-gray col-span-1 h-[207px] rounded-[13px] px-5 py-5">
          <div className="flex gap-3 items-center pb-5">
            <IconDollar />
            <p className="text-[22px] font-bold text-expresscash-textos">
              Préstamos
            </p>
          </div>
          <p className="text-[46.08px] font-bold text-expresscash-textos mb-4">
            272
            <span className="text-[22px] font-book text-expresscash-textos ml-2">
              solicitudes
            </span>
          </p>

          <div className="flex gap-2 items-center">
            <IconSelector state={false} />
            <ColorfulText state={false} text="-17%" />
            <p className="text-[22px] text-expresscash-gray2 font-book">
              esta semana
            </p>
          </div>
        </div>
        <div className="border-[1px] border-expresscash-gray col-span-1 h-[207px] rounded-[13px] px-5 py-5">
          <div className="flex gap-3 items-center pb-5">
            <IconBuy />
            <p className="text-[22px] font-bold text-expresscash-textos">
              ArgenCompras
            </p>
          </div>
          <p className="text-[46.08px] font-bold text-expresscash-textos mb-4">
            89
            <span className="text-[22px] font-book text-expresscash-textos ml-2">
              ventas
            </span>
          </p>

          <div className="flex gap-2 items-center">
            <IconSelector state={true} />
            <ColorfulText state={true} text="+4%" />
            <p className="text-[22px] text-expresscash-gray2 font-book">
              esta semana
            </p>
          </div>
        </div>
        <div className="border-[1px] border-expresscash-gray col-span-1 h-[207px] rounded-[13px] px-5 py-5">
          <div className="flex gap-3 items-center pb-5">
            <IconStarts />
            <p className="text-[22px] font-bold text-expresscash-textos">
              Puntos expresscash
            </p>
          </div>
          <p className="text-[46.08px] font-bold text-expresscash-textos mb-4">
            68.2k
            <span className="text-[22px] font-book text-expresscash-textos ml-2">
              ganados
            </span>
          </p>

          <div className="flex gap-2 items-center">
            <IconSelector state={false} />
            <ColorfulText state={false} text="-3%" />
            <p className="text-[22px] text-expresscash-gray2 font-book">
              esta semana
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
