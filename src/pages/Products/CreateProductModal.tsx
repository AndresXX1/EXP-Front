import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProductAsync } from "../../store/actions/product"; // Importa la acción
import { IconPencil, IconX } from "@utils/svg";
import Modal from "@components/Modal";
import { RootState, AppDispatch } from "../../store";
import { IProduct } from ".";

interface CreateProductModalProps {
  isOpen: boolean;
  closeModal: () => void;
  refreshProducts: (newProduct: IProduct) => void; // Recibe la función para actualizar la lista
  product?: any;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  closeModal,
  refreshProducts,
  product,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [modalCanceled, setModalCanceled] = useState<boolean>(false);
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.value || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "ArgenCompras");
  const [includeShipping, setIncludeShipping] = useState(false);
  const [image, setImage] = useState<string | null>(product?.image ?? null);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  const { loading, error } = useSelector((state: RootState) => ({
    loading: state.Product.loading,
    error: state.Product.error,
  }));

  const handleCancel = () => {
    setModalCanceled(true);
    closeModal();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageFile(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);  // Muestra la imagen seleccionada
    } else {
      setImage(null);  // No seleccionó una imagen
    }
  };

  const handleSave = async () => {
    let formIsValid = true;
    const newErrors = { name: "", price: "", description: "", category: "", image: "" };
  
    // Validación de los campos
    if (!name) {
      formIsValid = false;
      newErrors.name = "El nombre es obligatorio.";
    }
    if (!price) {
      formIsValid = false;
      newErrors.price = "El valor es obligatorio.";
    } else if (Number(price) > 999999) {
      formIsValid = false;
      newErrors.price = "El valor no puede ser mayor a 999999 puntos.";
      setPrice("999999");  // Ajustamos el valor al máximo permitido
    }
    if (!description) {
      formIsValid = false;
      newErrors.description = "La descripción es obligatoria.";
    }
    if (!category) {
      formIsValid = false;
      newErrors.category = "La categoría es obligatoria.";
    }
    if (!imageFile) {
      formIsValid = false;
      newErrors.image = "La imagen es obligatoria.";
    }
  
    setErrors(newErrors);
  
    if (!formIsValid) return;
  
 
    const productData = {
      name,
      description,
      value: price,
      category,
      includesShipping: includeShipping, 
    };
  
   
    console.log("Datos del producto a enviar:", productData);
    console.log("Archivo de imagen:", imageFile);
  
    try {
   
      const actionResult = await dispatch(createProductAsync({
        productData,
        imageFile, 
      }));

      const newProduct = actionResult.payload;
      if (newProduct) {
        refreshProducts(newProduct); 
        closeModal(); 
      }
  
    
      setName("");
      setPrice("");
      setDescription("");
      setCategory("ArgenCompras");
      setIncludeShipping(false);
      setImageFile(undefined);
      setImage(null);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    if (value.length > 25) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "El nombre no puede tener más de 15 caracteres.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "", 
      }));
    }
  
    setName(value);
  };
  
  



  return (
    <>
     
      <Modal
        isShown={modalCanceled}
        element={
          <div className="px-6 py-6 flex flex-col justify-center gap-5 w-[481px] h-[192px]">
            <div className="flex justify-between items-center">
              <p className="text-[1rem] text-Express-Cash-textos font-bold">
                ¿Está seguro que desea salir?
              </p>
              <p
                className="cursor-pointer"
                onClick={() => setModalCanceled(false)}
              >
                <IconX />
              </p>
            </div>
            <p className="text-[14px] font-book text-Express-Cash-gray w-[380px]">
              Se descartarán los cambios que hayas realizado.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  closeModal(); 
                  setModalCanceled(false); 
                }}
                className="bg-Express-Cash-red w-[109px] h-[38px] rounded-[5px] text-Express-Cash-white text-[1rem] font-book"
              >
                Salir
              </button>
              <button
                onClick={() => setModalCanceled(false)}
                className="border-[1px] border-solid border-Express-Cash-gray w-[109px] h-[38px] rounded-[5px] text-Express-Cash-gray text-[1rem] font-book"
              >
                Cancelar
              </button>
            </div>
          </div>
        }
      ></Modal>


      <div className="modal">
        <div className="modal-content">
          <div className="flex justify-between items-center">
            <p className="text-[32px] text-Express-Cash-textos font-bold">
              {product ? "Editar producto" : "Crear producto"}
            </p>
            <p className="cursor-pointer" onClick={handleCancel}>
              <IconX />
            </p>
          </div>
          <div className="mt-5">
            <div className="flex gap-12">
              <div>
              <div className="flex items-center justify-center rounded-[13px] w-[185px] h-[185px] bg-Express-Cash-gray3 border-[1px] border-solid border-Express-Cash-gray2">
              <img
                  className="w-[170px] h-[170px]"
                  src={image || "/products/image_default.png"} 
                />
          </div>
          <p
            className="flex gap-1 items-center pt-[18px] text-[14px] font-book text-Express-Cash-textos cursor-pointer"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <IconPencil />
            {product ? "Editar fotos" : "Añadir fotos"}
          </p>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }} 
            onChange={handleImageChange}
          />

          
          {errors.image && (
            <p className="text-red-500 text-sm mt-2">{errors.image}</p> 
          )}
                <p className="pt-9 pb-4 text-[14px] font-bold text-Express-Cash-textos">
                  Incluye envío
                </p>
                <div className="flex gap-5">
                  <div className="flex items-center gap-3 rounded-[4px]">
                    <p>Si</p>
                    <input
                      className="border-[1px] border-solid border-Express-Cash-gray rounded-[4px]"
                      type="checkbox"
                      checked={includeShipping}
                      onChange={() => setIncludeShipping(!includeShipping)}
                    />
                  </div>
                  <div className="flex items-center gap-3 rounded-[4px]">
                    <p>No</p>
                    <input
                      className="border-[1px] border-solid border-Express-Cash-gray rounded-[4px]"
                      type="checkbox"
                      checked={!includeShipping}
                      onChange={() => setIncludeShipping(!includeShipping)}
                    />
                  </div>
                </div>
                <p className="pt-9 pb-4 text-[14px] font-bold text-Express-Cash-textos">
                  Colores disponibles
                </p>
               
                <div className="w-[17px] h-[17px] rounded-full bg-Express-Cash-skyBlue"></div>
              </div>

              <div className="flex flex-col gap-4">
              <label className="text-Express-Cash-textos font-bold text-[14px]" htmlFor="product-name">
                Nombre del producto
              </label>
              <input
                id="product-name"
                className={`w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.name ? 'border-red-500' : 'border-Express-Cash-gray'}`}
                type="text"
                value={name}
                onChange={handleNameChange}
                maxLength={25}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>} 

              <label className="text-Express-Cash-textos font-bold text-[14px]" htmlFor="product-price">
                Valor del producto (puntos)
              </label>
              <input
                id="product-price"
                className={`w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.price ? 'border-red-500' : 'border-Express-Cash-gray'}`}
                type="number"
                value={price}
                max={999999} 
                onChange={(e) => {
                  let value = Number(e.target.value);

                  if (value > 999999) {
                    value = 999999;
                    setErrors(prevErrors => ({ ...prevErrors, price: "El valor no puede ser mayor a 999999 puntos." }));
                  } else {
                    setErrors(prevErrors => ({ ...prevErrors, price: "" }));
                  }

                  setPrice(value.toString());
                }}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}


                <label className="text-Express-Cash-textos font-bold text-[14px]" htmlFor="product-category">
                  Categoría
                </label>
                <select
                  id="product-category"
                  className={`w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.category ? 'border-red-500' : 'border-Express-Cash-gray'}`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="ArgenCompras">ArgenCompras</option>
                  <option value="Merch Express-Cash">Merch Express-Cash</option>
                  <option value="Experiencia">Experiencia</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

                <label className="text-Express-Cash-textos font-bold text-[14px]" htmlFor="product-description">
                  Descripción
                </label>
                <textarea
                  id="product-description"
                  className={`w-[617px] h-[181px] text-[16px] font-book p-3 text-Express-Cash-textos align-top border ${errors.description ? 'border-red-500' : 'border-Express-Cash-gray'} rounded-[5px] resize-none placeholder:text-Express-Cash-textos`}
                  placeholder="Cuerpo de texto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-10">
            <button
              onClick={handleCancel} 
              className="border-[1px] border-solid border-Express-Cash-gray w-[109px] h-[38px] rounded-[5px] text-Express-Cash-gray text-[1rem] font-book"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave} 
              className="bg-Express-Cash-skyBlue w-[109px] h-[38px] rounded-[5px] text-Express-Cash-white text-[1rem] font-book hover:bg-Express-Cash-blue hover:transition-colors duration-100"
              disabled={loading} 
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>} 
        </div>
      </div>
    </>
  );
};

export default CreateProductModal;


