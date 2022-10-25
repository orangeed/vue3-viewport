import request from "../utils/request";

interface LoginInfo {
  openId: string;
}

// 登录
export const login = (data: LoginInfo): Promise<any> => {
  return request({
    url: "/taxi-wechat/user/login",
    method: "POST",
    data,
  });
};
