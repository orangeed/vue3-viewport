export const setStorge = (key: string, value: any) => {
    return uni.setStorageSync(key, JSON.stringify(value));
  };
  
  export const getStorge = (key: string) => {
    // return uni.getStorageSync(key);
    // return JSON.parse(uni.getStorageSync(key));
    const str = uni.getStorageSync(key);
    if (str) {
      return JSON.parse(str);
    } else {
      return null;
    }
  };
  
  export const removeStorge = (key: string) => {
    uni.removeStorageSync(key);
  };
  
  export const clearStorge = () => {
    uni.clearStorage();
  };
  