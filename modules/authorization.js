import {
    openElement,
    shutdownElement,
} from "./common.js";
import {
    postLogin,
    setToken,
} from "./api.js";
import {
    renderAddForm,
    renderAuthorizationForm,
} from "./render.js";

let name = '';
let authorization = true;   //Окно авторизации (акт)
let authorized = false;     //Авторизированный пользователь
let registration = false;   //Регистрация/Вход
let authorizationFormElement;

//Закрыть авторизацию
export function closeAuthorization(authorizationCloseButton, headerAuthorizationElement, authorizationElement, containerComments) {
    authorizationCloseButton.addEventListener('click', () => {
        shutdownElement(authorizationElement);
        openElement(headerAuthorizationElement);
        containerComments.classList.remove('blur');
    })
}

//Кнопка входа
export function entranceAuthorization(containerComments, authorizationElement, addFormElement) {
    const entranceButton = document.getElementById("authorization-entrance");
    const loginInput = document.getElementById("login-input");
    const passwordInput = document.getElementById("password-input");
    entranceButton.addEventListener('click', () => {
        postLogin(
            loginInput.value.trim(),
            passwordInput.value.trim())
            .then((response) => {
                switch (response.status) {
                    case 201:
                        return response.json();
                    case 400:
                        alert("Передан неправильный логин или пароль!");
                        return Promise.reject('Ошибка ввода!');
                    default:
                        return Promise.reject('Ошибка');
                }
            })
            .then((responseData) => {
                name = responseData.user.name;
                authorized = true;
                setToken(responseData.user.token);
                shutdownElement(authorizationElement);
                containerComments.classList.remove('blur');
                addFormElement.value = name;
            })
    })
}

//Кнопка регистрации
export function registrationAuthorization() { }


//Регистрация/Вход
export function regEntAuthorization(authorizationregEntButton) {
    authorizationregEntButton.addEventListener('click', () => {
        registration ? registration = false : registration = true;
        renderAuthorizationForm(authorizationFormElement);
    })
}

//Кнопки перехода к регистрации/входу
export function goToRegEnt(headerAuthorizationElement, authorizationElement, containerComments) {
    const headerButtonEntrance = document.getElementById('header-button-entrance');
    const headerButtonRegistration = document.getElementById('header-button-registration');
    headerButtonEntrance.addEventListener('click', () => {
        registration = false;
        openElement(authorizationElement);
        shutdownElement(headerAuthorizationElement);
        containerComments.classList.add('blur');
        renderAuthorizationForm(authorizationFormElement);
    })
    headerButtonRegistration.addEventListener('click', () => {
        registration = true;
        openElement(authorizationElement);
        shutdownElement(headerAuthorizationElement);
        containerComments.classList.add('blur');
        renderAuthorizationForm(authorizationFormElement);
    })
}

export function getAuthorizationFormElement() {
    return authorizationFormElement;
}

export function getName() {
    return name;
}

export function getRegistration() {
    return registration;
}

export function getAuthorized() {
    return authorized;
}

export function getAuthorization() {
    return authorization;
}

export function setAuthorizationFormElement(tAFE) {
    authorizationFormElement = tAFE;
}

export function setRegistration(tR) {
    registration = tR;
}

export function setAuthorization(tA) {
    authorization = tA;
}
