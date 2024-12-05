import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import { alertError, alertConfirm } from "@utils/alerts";

export const createProductService = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(apiUrls.createProduct(), formData, {
      headers: {
        "Content-Type": "multipart/form-data",  // Asegúrate de que el Content-Type sea multipart/form-data
      }
    });

    if (response.data.ok) {
      alertConfirm("Producto creado correctamente");
      return response.data.product;
    } else {
      alertError("Error al crear el producto");
      return null;
    }
  } catch (error) {
    alertError("Error al crear el producto");
    console.error("Error al crear el producto", error);
    return null;
  }
};



const getAllProductsService = async () => {
    try {
      const response = await axiosInstance.get(apiUrls.allProducts()); 
      if (response.data.ok) {
        return response.data.products; 
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      return null; 
    }
  };


// Función para actualizar un producto
export const updateProductService = async (id: number, productData: {
  name: string;
  description: string;
  value: number;
  image?: string | null;
  includesShipping: boolean;
}) => {
  try {
    const response = await axiosInstance.put(apiUrls.updateProduct(id), productData);
    if (response.data.ok) {
      alertConfirm("Producto actualizado correctamente");
      return response.data.product; // Devuelve el producto actualizado
    } else {
      alertError("Error al actualizar el producto");
      return null;
    }
  } catch (error) {
    alertError("Error al actualizar el producto");
    return null;
  }
};  


export const deleteProductService = async (id: number) => {
  try {
    const response = await axiosInstance.delete(apiUrls.deleteProduct(id));
    
  
    if (response.data && response.data.ok) {
      alertConfirm("Producto eliminado correctamente");
      return true;
    } else {
      alertError("Error al eliminar el producto");
      return false;
    }
  } catch (error) {
    alertError("Error al eliminar el producto");
    console.error("Error al eliminar el producto", error);
    return false;
  }
};

export const uploadProductImage = async (formData: FormData): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/products/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data.ok && data.imageUrl) {
      return data.imageUrl; // Retorna la URL de la imagen subida
    } else {
      throw new Error("Error al subir la imagen");
    }
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    return "";
  }
};

  export {getAllProductsService}

