export const checkStatus = (timestamp: string) => {
  const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
  const currentTime = new Date().getTime();
  const givenTime = new Date(timestamp).getTime();
  if (currentTime - givenTime > oneWeekInMillis) {
    return "inactivo";
  } else {
    return "activo";
  }
};
