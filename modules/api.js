import {
    hidingAddingElement,
} from "./common.js";

const commentURL = "https://wedev-api.sky.pro/api/v2/ivan-uskov/comments";
const userURL = "https://wedev-api.sky.pro/api/user";
const loginURL = "https://wedev-api.sky.pro/api/user/login"
let token;

//Получить данные от API
export function getCommentData() {
    return fetch(commentURL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .catch(() => {
            hidingAddingElement();
            alert('Ошибка соединения, попробуйте позже!');
            return Promise.reject('Ошибка соединения!');
        })
        .then((response) => {
            switch (response.status) {
                case 401:
                    return Promise.reject('Ошибка авторизации!');
                case 500:
                    hidingAddingElement();
                    alert('Сервер сломался, попробуйте позже!');
                    return Promise.reject('Ошибка сервера!');
                default:
                    return response.json();
            }
        })
}

//Отправить данные в API
export function postCommentData(name, text) {
    return fetch(commentURL,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
                {
                    name: name,
                    //date: toLocalDate(currentDate),
                    text: text,
                    // textReply: nLevel === 0 ? '' : `QUOTE_BEGIN ${nText} QUOTE_END`,
                    // likes: 0,
                    // likesFlag: false,
                    // isEdit: false,
                    // otherEdit: false,
                    // nestingLevel: nLevel
                    forceError: true,
                }
            )
        })
}

//Вход по логину
export function postLogin(login, password) {
    return fetch(loginURL,
        {
            method: "POST",
            body: JSON.stringify(
                {
                    login: login,
                    password: password,
                }
            )
        })
}

//Записать токен
export function setToken(tToken) {
    token = tToken;
}