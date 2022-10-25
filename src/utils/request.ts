import { getStorge } from "./sessionStorge";

// 接口地址
const baseURL: string = import.meta.env.VITE_GLOB_API_URL;

enum Method {
  GET,
  POST,
  DELETE,
  PUT,
}

type RequestMethod = keyof typeof Method;

interface Options {
  url: string;
  method?: RequestMethod;
  data?: object | any;
  params?: object | any;
  headers?:any
}

// 封装公共请求方法
const request = (
  options: Options = {
    url: "",
    method: "GET",
    data: {},
    params: {},
  }
): Promise<any> => {
  return new Promise(function (resolve, reject) {
    let header: any;
    if (getStorge("token") !== undefined && getStorge("token") !== "") {
      header = {
        "content-type": "application/json",
        // Authorization: `Bearer ${getStorge("token").replace(/"/g, "")}`,
        Authorization: `Bearer ${getStorge("token")}`,
      };
    } else {
      header = {
        "content-type": "application/json",
      };
    }
    uni.request({
      url: baseURL + options.url,
      method: options.method,
      data: options.data ? options.data : options.params,
      header: header,
      success(res: any) {
        console.log(res);
        uni.hideLoading();
        if (res.data.status === 200) {
          resolve(res.data);
        } else {
          //其他异常
          uni.showToast({
            title: res.data.message,
            icon: "none",
          });
          reject(res.data);
        }
      },
      fail(err) {
        uni.hideLoading();
        //请求失败
        uni.showToast({
          title: "无法连接到服务器",
          icon: "none",
        });
        reject(err);
      },
    });
  });
};

// export { request, baseURL };
export default request;
