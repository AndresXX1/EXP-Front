    import { useState } from "react";
    import { IconEdit } from "@utils/svg";
    import { uploadImgBanner } from "@store/services/banners";
    import { alertError } from "@utils/alerts";

    interface CreateBannerProps {
    closeModal: () => void;
    getBannersList: () => void;
    type: string
    }

    export default function CreateBanner({ closeModal, getBannersList, type }: CreateBannerProps) {
    const [selectedLink, setSelectedLink] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        setImage(e.target.files[0]);
        }
    };

    
    const handleSave = async () => {
        if (image && selectedLink) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("redirect", selectedLink);
    
        // Verifica si 'type' tiene el valor esperado antes de la llamada
        console.log("type", type);
    
        if (type) {
            // Usa el 'type' correcto en la URL del API
            const result = await uploadImgBanner(formData, type);
    
            if (result) {
            getBannersList();  // Llamada para obtener la lista de banners actualizada
            closeModal();
            }
        } else {
            console.log('Tipo de banner:', type);
if (!type) {
  alertError("El tipo de banner no es válido.");
  return;
}
        }
        } else {
        alertError("Por favor, selecciona una imagen y una opción de redirección.");
        }
    };

    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
            {/* Título del modal */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crear Nuevo Banner</h2>

            {/* Contenido del modal */}
            <div className="p-4 space-y-6">
            <div className="flex gap-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center w-1/2">
                <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    {image ? (
                    <img src={URL.createObjectURL(image)} alt="Banner" className="w-full h-auto rounded-md" />
                    ) : (
                    <div className="text-gray-400">
                        {/* Icono de subida */}
                    </div>
                    )}
                </div>
                <label htmlFor="file-upload" className="cursor-pointer text-sm text-gray-600 flex items-center justify-center">
                    <IconEdit className="mr-2 text-gray-600" />
                    {image ? "Cambiar imagen" : "Subir una imagen"}
                </label>
                <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    className="mt-2 w-full hidden"
                />
                </div>
                {/* Select de redirección */}
                <div className="w-1/2">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Redirigir a:</label>
                    <select
                    value={selectedLink}
                    onChange={(e) => setSelectedLink(e.target.value)}
                    className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                    >
                    <option value="">Seleccionar</option>
                    <option value="noticias">Noticias</option>
                    <option value="Products">Mis préstamos</option>
                    <option value="perfil">Perfil</option>
                    <option value="argencompras">ArgenCompras</option>
                    <option value="cuponizate">Cuponizate</option>
                    <option value="canjear">Canjear puntos</option>
                    <option value="medios">Medios de pago para tus cuotas</option>
                    </select>
                </div>
                </div>
            </div>
            </div>
            {/* Botones de cancelar y guardar */}
            <div className="flex justify-end gap-4 px-6 py-4">
            <button onClick={closeModal} className="px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">Cancelar</button>
            <button onClick={handleSave} className="px-6 py-3 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md">Guardar</button>
            </div>
        </div>
        </div>
    );
    }
