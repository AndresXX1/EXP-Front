/* eslint-disable @typescript-eslint/no-unused-vars */
import { RootState } from "@store";
import { getData } from "@store/services/admin";
import { getFormattedDate } from "@utils/format";
import {
  ArrowLeft,
  IconArrows,
  IconDownload,
  IconIncrease,
  IconLower,
  IconMagnifyingGlass,
  IconStarts,
  IconSuscriber,
  IconTime,
} from "@utils/svg";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BarChartComponent from "./graficoCantUsers";
import MontoTotalPrestamosChart from "./graficoMontTotal";
import PaymentMethodsChart from "./GraficoFormPago";
import DeliveryMethodsChart from "./GraphDevileryForm";
import MoreProvinceChart from "./GraphMoreProvince";

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
  const [, setData] = useState<IDataDashboard | null>(null);

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

  useEffect(() => {
    getDataApi();
  }, []);

  return (
    <div className="flex flex-col px-4 sm:px-10 lg:px-16 py-12 bg-white min-h-[1800px] max-h-[1800px]">
      {/* Header */}
      <h2 className="text-2xl sm:text-4xl lg:text-5xl text-gray-800 font-bold">
        Bienvenido, {user?.full_name || "Felix"}.
      </h2>

      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <div className="flex items-center border border-expresscash-skyBlue rounded-lg px-4 h-[42px]">
          <span className="text-sm text-gray-700">Semanal</span>
          <ArrowLeft className="w-4 h-4 ml-2 rotate-90" />
        </div>
        <button className="flex items-center gap-2 bg-[#8CC63F] text-white px-4 h-[42px] rounded-lg hover:bg-[#68A589] transition-colors">
          <IconDownload />
          <span className="text-sm">Descargar planilla</span>
        </button>
      </div>

      {/* Date indicator */}
      <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
        <div className="w-2 h-2 rounded-full bg-[#8CC63F]" />
        <span>{getFormattedDate()}</span>
        <IconArrows />
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg border border-[#8CC63F] p-6 h-[140px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-gray-400 mt-[-20px]">
              <IconStarts />
            </div>
            <h3 className="text-[18px] font-medium text-gray-700 mt-[-20px]">
              Usuarios nuevos
            </h3>
          </div>
          <p className="text-[30px] text-center font-semibold text-gray-900 mb-4">
            102
          </p>
          <div className="flex items-center gap-2 text-center">
            <IconSelector state={true} />
            <ColorfulText state={true} text="+12%" />
            <span className="text-sm text-gray-500">esta semana</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#8CC63F] p-6 h-[140px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-gray-400 mt-[-20px]">
              <IconTime />
            </div>
            <h3 className="text-[18px] font-medium text-gray-700 mt-[-20px]">
              Nuevos préstamos
            </h3>
          </div>
          <p className="text-[30px] font-semibold text-gray-900 mb-4 text-center">
            12%
          </p>
          <div className="flex items-center gap-2">
            <IconSelector state={false} />
            <ColorfulText state={false} text="-11%" />
            <span className="text-sm text-gray-500">esta semana</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#8CC63F] p-6 h-[140px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-gray-400 mt-[-20px]">
              <IconSuscriber />
            </div>
            <h3 className="text-[16px] font-medium text-gray-700 mt-[-20px]">
              Abandono del carrito
            </h3>
          </div>
          <p className="text-[30px] font-semibold text-gray-900 mb-4 text-center">
            5%
          </p>
          <div className="flex items-center gap-2">
            <IconSelector state={false} />
            <ColorfulText state={false} text="+1%" />
            <span className="text-sm text-gray-500">esta semana</span>
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {/* First chart - Cantidad de préstamos */}
        <div className="col-span-1 bg-white rounded-lg border border-[#8CC63F] p-6">
          <BarChartComponent />
        </div>

        {/* Second chart - Monto total prestado */}
        <div className="col-span-1 bg-white rounded-lg border border-[#8CC63F] p-6">
          <MontoTotalPrestamosChart />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {/* Payment method chart - left side */}
        <div className="col-span-1 bg-white rounded-lg border border-[#8CC63F] p-6">
          <PaymentMethodsChart />
        </div>

        {/* Province chart - right side, spans two rows */}
        <div className="col-span-1 row-span-2 bg-white rounded-lg border border-[#8CC63F] p-6 mb-12">
          <MoreProvinceChart />
        </div>

        {/* Delivery method chart - bottom left */}
        <div className="col-span-1 bg-white rounded-lg border border-[#8CC63F] p-6 mb-12">
          <DeliveryMethodsChart />
        </div>
      </div>
    </div>
  );
};

export default Home;
