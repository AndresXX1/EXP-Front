/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { updateProductAsync } from "../../store/actions/product";
import { IconPencil, IconX } from "@utils/svg";
import Modal from "@components/Modal";

interface EditProductModalProps {
  isOpen: boolean;
  closeModal: () => void;
  product: any;
  saveProduct: (updatedProduct: any) => void;
  updateProductInList?: (updatedProduct: any) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  closeModal,
  product,
  saveProduct,
  updateProductInList,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  if (!isOpen) return null;

  const [productName, setProductName] = useState<string>(product?.name || "");
  const [productPrice, setProductPrice] = useState<string>(
    product?.value || ""
  );
  const [productDescription, setProductDescription] = useState<string>(
    product?.description || ""
  );
  const [category, setCategory] = useState<string>(
    product?.category || "ArgenCompras"
  );
  const [includeShipping, setIncludeShipping] = useState<boolean>(
    product?.includesShipping || false
  );
  const [image, setImage] = useState<string | null>(product?.image || null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });
  const [modalCanceled, setModalCanceled] = useState<boolean>(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setUploadedImage(file);
    } else {
      setImage(null);
    }
  };

  const handleShippingChange = () => {
    setIncludeShipping(!includeShipping);
  };

  const validateFields = () => {
    let formIsValid = true;
    const newErrors = {
      name: "",
      price: "",
      description: "",
      category: "",
      image: "",
    };

    if (!productName) {
      formIsValid = false;
      newErrors.name = "El nombre es obligatorio.";
    } else if (productName.length > 20) {
      formIsValid = false;
      newErrors.name = "El nombre no puede exceder los 20 caracteres.";
    }

    if (!productPrice) {
      formIsValid = false;
      newErrors.price = "El valor es obligatorio.";
    } else if (Number(productPrice) > 999999) {
      formIsValid = false;
      newErrors.price = "El valor no puede ser mayor a 999999 puntos.";
      setProductPrice("999999");
    }

    if (!productDescription) {
      formIsValid = false;
      newErrors.description = "La descripción es obligatoria.";
    }

    if (!category) {
      formIsValid = false;
      newErrors.category = "La categoría es obligatoria.";
    }

    if (!uploadedImage) {
      formIsValid = false;
      newErrors.image = "La imagen es obligatoria.";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("value", productPrice);
      formData.append("description", productDescription);
      formData.append("category", category);
      formData.append("includesShipping", includeShipping ? "true" : "false");

      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }
      formData.append("categories", JSON.stringify(product.categories));

      const updatedProduct = await dispatch(
        updateProductAsync({ id: product.id, productData: formData })
      );

      console.log("Producto actualizado", updatedProduct);

      saveProduct(updatedProduct);
      console.log("aca", saveProduct);

      if (updateProductInList) {
        updateProductInList(updatedProduct);
      }

      closeModal();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setProductPrice(product.value.toString());
      setProductDescription(product.description);
      setCategory(product.category || "ArgenCompras");
      setIncludeShipping(product.includesShipping || false);
      setImage(
        product.image ? `https://back5.maylandlabs.com/${product.image}` : null
      );
    }
  }, [product]);

  const handleCancel = () => {
    setModalCanceled(true);
  };

  const confirmCancel = () => {
    closeModal();
    setModalCanceled(false);
  };

  return (
    <>
      <Modal
        isShown={modalCanceled}
        element={
          <div className="px-6 py-6 flex flex-col justify-center gap-5 w-[481px] h-[192px]">
            <div className="flex justify-between items-center">
              <p className="text-[1rem] text-expresscash-textos font-bold">
                ¿Está seguro que desea salir?
              </p>
              <p
                className="cursor-pointer"
                onClick={() => setModalCanceled(false)}
              >
                <IconX />
              </p>
            </div>
            <p className="text-[14px] font-book text-expresscash-gray w-[380px]">
              Se descartarán los cambios que hayas realizado.
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmCancel}
                className="bg-expresscash-red w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-book"
              >
                Salir
              </button>
              <button
                onClick={() => setModalCanceled(false)}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-book"
              >
                Cancelar
              </button>
            </div>
          </div>
        }
      ></Modal>

      {/* Modal de edición */}
      <div className="modal">
        <div className="modal-content">
          <div className="flex justify-between items-center">
            <p className="text-[32px] text-expresscash-textos font-bold">
              Editar producto
            </p>
            <p className="cursor-pointer" onClick={handleCancel}>
              <IconX />
            </p>
          </div>
          <div className="mt-5">
            <div className="flex gap-12">
              <div>
                <div className="flex items-center justify-center rounded-[13px] w-[185px] h-[185px] bg-expresscash-gray3 border-[1px] border-solid border-expresscash-gray2">
                  <img
                    src={
                      image || `https://back5.maylandlabs.com/${product.image}`
                    }
                    alt={product.name}
                    className="w-[170px] h-[170px]"
                    onError={e => {
                      e.currentTarget.src = "/products/image_default.png";
                    }}
                  />
                </div>
                <p
                  className="flex gap-1 items-center pt-[18px] text-[14px] font-book text-expresscash-textos cursor-pointer"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <IconPencil />
                  Editar fotos
                </p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <label
                  className="text-expresscash-textos font-bold text-[14px]"
                  htmlFor="product-name"
                >
                  Nombre del producto
                </label>
                <input
                  id="product-name"
                  className={`w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.name ? "border-red-500" : "border-expresscash-gray"}`}
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value.slice(0, 20))}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}

                <label
                  className="text-expresscash-textos font-bold text-[14px]"
                  htmlFor="product-price"
                >
                  Valor del producto (puntos)
                </label>
                <input
                  id="product-price"
                  className={`w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.price ? "border-red-500" : "border-expresscash-gray"}`}
                  type="number"
                  value={productPrice}
                  max={999999}
                  onChange={e => {
                    let value = Number(e.target.value);

                    if (value > 999999) {
                      value = 999999;
                      setErrors(prevErrors => ({
                        ...prevErrors,
                        price: "El valor no puede ser mayor a 999999 puntos.",
                      }));
                    } else {
                      setErrors(prevErrors => ({ ...prevErrors, price: "" }));
                    }

                    setProductPrice(value.toString());
                  }}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}

                <label
                  className="text-expresscash-textos font-bold text-[14px]"
                  htmlFor="product-category"
                >
                  Categoría
                </label>
                <select
                  id="product-category"
                  className={`w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.category ? "border-red-500" : "border-expresscash-gray"}`}
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="ArgenCompras">ArgenCompras</option>
                  <option value="Merch expresscash">Merch expresscash</option>
                  <option value="Experiencia">Experiencia</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category}</p>
                )}

                <label
                  className="text-expresscash-textos font-bold text-[14px]"
                  htmlFor="product-description"
                >
                  Descripción
                </label>
                <textarea
                  id="product-description"
                  className="w-[617px] h-[181px] text-[16px] font-book p-3 text-expresscash-textos align-top border border-expresscash-gray rounded-[5px] resize-none placeholder:text-expresscash-gray"
                  value={productDescription}
                  onChange={e => setProductDescription(e.target.value)}
                  placeholder="Descripción"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}

                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={includeShipping}
                    onChange={handleShippingChange}
                  />
                  <span className="text-expresscash-textos font-bold text-[14px]">
                    Incluir envío
                  </span>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleSave}
                    className="bg-expresscash-skyBlue w-[150px] h-[50px] rounded-[5px] text-expresscash-white text-[16px] font-book"
                  >
                    Guardar cambios
                  </button>
                  <button
                    onClick={closeModal}
                    className="border-[1px] border-solid border-expresscash-gray w-[150px] h-[50px] rounded-[5px] text-expresscash-gray text-[16px] font-book"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProductModal;
