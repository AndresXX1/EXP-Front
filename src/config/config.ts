export const baseUrl = import.meta.env.VITE_PUBLIC_BACKEND_URL;

export const apiUrls = {
  // auth
  logIn: () => `${baseUrl}/api/admin/log-in`,
  refreshToken: () => `${baseUrl}/api/admin/refresh-token`,
  logOut: () => `${baseUrl}/api/admin/log-out`,
  getSessions: () => `/api/admin/session`,
  deleteSession: (userId: number) => `/api/admin/session/${userId}`,
  resendCode: () => `${baseUrl}/api/admin/resend-code`,
  //user
  getUsers: () => `/api/user/all`,
  getUser: () => `${baseUrl}/api/admin`,
  avatarUser: (img: string) => `${baseUrl}/avatar/${img}`,
  putUserCuponizate: (userId: number) => `/api/user/cuponizate/${userId}`,
  avatarUserimage: () => `${baseUrl}/api/admin/avatar`,
  putUserById: (userId: number) => `${baseUrl}/api/user/update/${userId}`,
  putUserBlock: (userId: number) => `/api/user/${userId}/block`,
  putUserUnblock: (userId: number) => `/api/user/${userId}/unblock`,
  //  direcciónes para un usuario específico desde admin
  createAddress: (userId: number) => `${baseUrl}/api/user/${userId}/address`,
  getUserAddresses: (userId: number) =>
    `${baseUrl}/api/user/${userId}/addresses`,
  editUserAddress: (userId: number, index: number) =>
    `${baseUrl}/api/user/${userId}/address/${index}`,
  deleteUserAddress: (userId: number, index: number) =>
    `${baseUrl}/api/user/${userId}/address/${index}`,
  //banner
  getBannersHome: () => `/api/banner/home`,
  getBannersCuponizate: () => `/api/banner/cuponizate`,
  getBannersArgenCompras: () => `/api/banner/argencompras`,
  uploadBanner: (type: string) => `/api/banner/${type}`,
  deleteBanner: (id: string) => `/api/banner/${id}`,
  bannerImg: (img: string) => `${baseUrl}/banner/${img}`,
  //notice
  getNotices: () => `/api/notice`,
  uploadImageNotice: () => `/api/notice/image`,
  uploadNotice: () => `/api/notice`,
  deleteNotice: (id: string) => `/api/notice/${id}`,
  noticeImg: (img: string) => `${baseUrl}/notice/${img}`,
  // admin
  getAllAdmins: () => `/api/admin/all`,
  deleteAdminById: (id: string) => `/api/admin/remove/${id}`,
  uploadImgAvatar: () => `/api/admin/avatar`,
  createAdmin: () => `/api/admin/create`,
  uploadMyAvatar: () => `/api/admin/avatar`,
  removeMyAvatar: () => `/api/admin/avatar`,
  updateFullname: () => `/api/admin/full-name`,
  updatePassword: () => `/api/admin/password`,
  getData: () => `/api/admin/data`,
  //product
  getProductsAll: () => `/api/product/all`,
  changeOfVisibilityProduct: (id: string) => `/api/product/visibility/${id}`,
  //product por puntos
  createProduct: () => "/api/product/create",
  allProducts: () => "/api/product/allProducts",
  updateProduct: (id: number | string) => `/api/product/update/${id}`,
  deleteProduct: (id: number) => `/api/product/deleteAdmin/${id}`,
  productImg: (img: string) => {
    return `${baseUrl.replace(/\/$/, "")}/images/products/${img}`;
  },
  //branch
  getBranches: () => `/api/branch`,
  BranchImg: (img: string) => `${baseUrl}/branch/${img}`,
  uploadImageBranch: () => `/api/branch/image`,
  createBranch: () => `/api/branch`,
  updateBranch: (id: string) => `api/branch/${id}`,
  deleteBranch: (id: string) => `api/branch/${id}`,
  //notification
  createNotification: () => `/api/notifications/create`,
  getAllNotifications: () => `/api/notifications`,
  getNextNotifications: () => `/api/notifications/nextNotifications`,
  getOldNotifications: () => `/api/notifications/oldNotifications`,
  deleteNotification: (id: number) => `/api/notifications/${id}`,
  updateNotification: (id: number) => `api/notifications/${id}`,
};

export const tokenAccess = {
  tokenName: import.meta.env.VITE_PUBLIC_TOKEN_NAME || "token",
  refreshTokenName:
    import.meta.env.VITE_PUBLIC_TOKEN_REFRESH_NAME || "refreshToken",
};

export const googleMapKey = import.meta.env.VITE_PUBLIC_MAP_API_KEY;
