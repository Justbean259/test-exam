export const formatAddress = (address: string, numb?: number) => {
  if (!address) return "";
  const first = address.substring(0, numb || 5);
  const last = address.substring(address.length - (numb || 5), address.length);
  return `${first}...${last}`;
};

export const formatNumber = (numb: number) => numb?.toLocaleString("en-US");
