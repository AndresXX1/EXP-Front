import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import {
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  BarController,
} from "chart.js";

// Registramos los elementos necesarios de Chart.js
Chart.register(
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  BarController
); // Agrega BarController aquí

const BarChartComponent = () => {
  const chartContainerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = new Chart(chartContainerRef.current, {
        type: "bar", // Tipo de gráfico (de barras)
        data: {
          labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"], // Las etiquetas de los meses
          datasets: [
            {
              label: "Cantidad de Usuarios", // Título del gráfico
              data: [120, 150, 170, 200, 250, 300, 350], // Los datos de usuarios por mes
              backgroundColor: "#4A90E2", // Color de las barras
              borderColor: "#357ABD", // Color del borde de las barras
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Permite que el gráfico ocupe todo el espacio disponible
          plugins: {
            title: {
              display: true,
              text: "Cantidad de Usuarios por Mes",
            },
            tooltip: {
              enabled: true,
            },
          },
          scales: {
            y: {
              type: "linear", // Aseguramos que el eje Y tenga una escala lineal
              beginAtZero: true, // Asegura que las barras comienzan desde 0
            },
          },
        },
      });

      return () => {
        chart.destroy(); // Limpia el gráfico al desmontar el componente
      };
    }
  }, []);

  return (
    <div className="border-[1px] border-expresscash-gray col-span-2 h-[300px] rounded-[13px] p-4">
      {" "}
      {/* Aumenté la altura a 300px */}
      <div className="flex gap-3 items-center pb-5">
        <p className="text-[22px] font-bold text-expresscash-textos">
          Cantidad de usuarios
        </p>
      </div>
      {/* Este es el contenedor del gráfico de barras */}
      <div className="flex justify-center items-center w-full h-full">
        {" "}
        {/* Asegúrate de que el contenedor ocupe todo el espacio disponible */}
        <canvas ref={chartContainerRef} />
      </div>
      <div className="px-[22px] pt-3 flex gap-7">
        {/* Aquí puedes agregar el contenido adicional que desees */}
      </div>
    </div>
  );
};

export default BarChartComponent;
