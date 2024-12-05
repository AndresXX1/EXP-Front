import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";


export const getProductsAll = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getProductsAll());
    if (response.data.ok) {
      return response.data.products;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const changeOfVisibilityProduct = async (id: string) => {
  try {
    const response = await axiosInstance.put(
      apiUrls.changeOfVisibilityProduct(id)
    );
    if (response.data.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

