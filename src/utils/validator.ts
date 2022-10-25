import { idcardReg, phoneReg } from "./reg";

/**
 * 表单身份证认证
 * @param {*} rule
 * @param {*} value 输入的值
 * @param {*} callback 回调函数
 * @returns
 */
export const idcardValidator = (value: any) => {
    if (!value) return "身份证号码不能为空!";
    if (!idcardReg.test(value)) return "请输入正确的身份证号码!";
};

/**
 * 表单手机号验证
 * @param {*} rule
 * @param {*} value 输入的值
 * @param {*} callback 回调函数
 * @returns
 */
export const phoneValidator = (value: any) => {
    if (!value) return "手机号不能为空！";
    if (!phoneReg.test(value)) return "请输入正确的手机号码！";
};
