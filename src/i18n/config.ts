import i18n from "i18next";
import { initReactI18next } from "react-i18next";
//i18next-browser-languagedetector插件 
//这是一个 i18next 语言检测插件，用于检测浏览器中的用户语言，
//详情请访问：https://github.com/i18next/i18next-browser-languageDetector
import LanguageDetector from 'i18next-browser-languagedetector';

//import en from "./en-us.json";
//import hk from "./zh-hk.json";
import cn from "./zh-cn.json";

const resources = {
    cn: {
        translation: cn,
    },
    /* en: {
        translation: en,
    },
    hk: {
        translation: hk,
    }, */
};

i18n.use(LanguageDetector) //嗅探当前浏览器语言 zh-CN
    .use(initReactI18next).init({
        resources,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            caches: ['localStorage', 'sessionStorage', 'cookie'],
        }
    });

export default i18n;