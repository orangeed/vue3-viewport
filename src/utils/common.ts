/**
 * 处理静态图片，获取url，与vue2中使用webpack的require的作用一样
 * @param name
 * @returns
 */
export const getImageUrl = (name: string): string => {
  return new URL(`../static/image/${name}`, import.meta.url).href;
};

/**
 * base64转化为blob
 * @param base64URL
 * @returns
 */
export const base64toBlob = (base64URL: string) => {
  const mimeString = base64URL.split(",")[0].split(":")[1].split(";")[0]; // mime类型
  const byteString = window.atob(base64URL.split(",")[1]); //base64 解码
  const arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
  const intArray = new Uint8Array(arrayBuffer); //创建视图

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([intArray], { type: mimeString });
};

/**
 * 验证手机号是否正确
 * @param data 待验证的值
 * @returns
 */
export const checkPhoneNum = (data: string): boolean => {
  const reg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
  return reg.test(data);
};

/**
 * 数组对象扁平化
 * @param arr
 * @returns
 */
export const arr2Json = (arr: []): any => {
  return arr.reduce((p: any, v: any, i) => {
    for (let i = 0; i < p.length; i++) {
      if (p[i].child) {
        delete p[i].child;
      }
    }
    return p.concat(v.child ? arr2Json(v.child).concat(v) : v);
  }, []);
};

/**
 * 获取地址栏的数据
 * @param url
 * @returns
 */
import { removeStorge } from "./sessionStorge";
export const getQueryString = () => {
  const pathSearch = window.location.search;
  // localStorage.setItem('cache', pathSearch)
  // const cacheInfo = localStorage.getItem('cache')
  removeStorge("Token");
  console.log("pathSearch", pathSearch);
  if (pathSearch) {
    const name = pathSearch.split("?")[1].split("&");
    const urlInfo: any[] = [];
    name.forEach((v) => {
      const u = v.split("=");
      console.log(u);
      urlInfo.push({
        key: u[0],
        value: decodeURI(u[1]),
      });
    });
    return urlInfo;
  }
};

/**
 * uuid
 * @returns
 */
export const uuidFunction = () => {
  return new Promise((resolve) => {
    const s = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i += 1) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr(0x8, 1);
    s[8] = "c";
    s[13] = "d";
    s[18] = "w";
    s[23] = "k";
    resolve(s.join(""));
  });
};

/**
 * 将临时图片转化未base64
 * @param imgUrl
 * @returns
 */
export const getBase64 = (imgUrl: string) => {
  // const img = new Image();
  return new Promise((resolve) => {
    uni.request({
      url: imgUrl,
      method: "GET",
      responseType: "arraybuffer",
      success: (res: any) => {
        console.log("res", res);
        const base64 = uni.arrayBufferToBase64(res.data);
        resolve("data:image/jpeg;base64," + base64);
      },
    });
  });
};

/**
 * 通过正则匹配需要的参数
 * @param name
 * @returns
 */
export const getQueryStringSingle = (name: string) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
};

export const action = (
  data: any,
  options = {
    text: "",
    value: "",
    children: "",
  }
) => {
  // 使用递归函数
  // if(!(data?.length <= 0)){
  // 等价于
  if (!data || data.length <= 0) {
    // 递归的出口
    return null;
  }
  return data.map((v: any) => {
    // 循环数据
    const model = {
      // 把后端返回过来的数据里面的键给替换成我想要的键
      text: v[options.text],
      value: v[options.value],
      children: v[options.children],
    };
    const children = action(v.child, {
      text: options.text,
      value: options.value,
      children: options.children,
    }); // 子级数据

    if (children) {
      // 一直往下循环查找有没有children这个键，如果有就直接添加一个子级字段名，这个字段名就是存子级数据
      model.children = children;
    }

    return model; // 返回这个数据
  });
};

interface UploadFile {
  url: string;
  filePath: string;
  name: string;
  formData: any;
}
/**
 * 上传文件
 * @param data
 * @returns
 */
export const uniUploadFile = (
  data: UploadFile = {
    url: "",
    filePath: "",
    name: "",
    formData: "",
  }
) => {
  const formData: any = {};
  const key = data.name;
  formData[key] = data.formData;
  console.log("formData", formData);
  return new Promise((resolve) => {
    uni.uploadFile({
      url: `${import.meta.env.VITE_GLOB_API_URL}${data.url}`,
      filePath: data.filePath,
      name: data.name,
      formData,
      success: (uploadFileRes) => {
        resolve(JSON.parse(uploadFileRes.data));
      },
    });
  });
};
