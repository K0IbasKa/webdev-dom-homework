import {
    renderCommentators,
} from "./render.js"
import {
    getAuthorized,
    getAuthorizationFormElement,
} from "./authorization.js";

export const state = {
    ON: 'on',
    OFF: 'off',
}


let loadingComment = true; // Прогрузка комментария
let nLevel = 0; // уровень вложенности (думал как-то сделать, но не придумал)
let nText = ''; // текст комментария, на который отвечают
let nName = ''; // Имя пользомателя, которомк отвечают

//Задержка ответа сервера
export function delayPromise(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}

//Скрыть элемент
export function shutdownElement(tElement) {
    tElement.classList.add('shutdown');
}

//Открыть Элемент 
export function openElement(tElement) {
    tElement.classList.remove('shutdown');
}

//Отключить элемент
export function offElement(tElement, fCursor) {
    document.getElementById(tElement).setAttribute('disabled', '');
    if (fCursor) tElement.classList.add('cursor-reset');
}

//Включить элемент
export function onElement(tElement, fCursor) {
    tElement.removeAttribute('disabled');
    if (fCursor) tElement.classList.remove('cursor-reset');
}

//Удалить послений коммератарий
export function deleteLastComment(listElement, tUsers, nL, nT, nN, deleteButton) {
    deleteButton.addEventListener('click', (event) => {
        if (!getAuthorized()) {
            const headerAuthorizationElement = document.getElementById("header");
            const containerComments = document.getElementById("container");
            shutdownElement(headerAuthorizationElement);
            containerComments.classList.add('blur');
            openElement(getAuthorizationFormElement());
            return;
        }
        event.stopPropagation();
        listElement.innerHTML = listElement.innerHTML.slice(0, listElement.innerHTML.lastIndexOf(`< li class="comment" > `));
        tUsers.pop();
        renderCommentators(listElement, tUsers, nL, nT, nN);
    });
}

// Скрыть элемент загрузки комментария
export function hidingAddingElement() {
    shutdownElement(commentAddingElement);
    loadingComment = true;
}






















export function getLoadingComment() {
    return loadingComment;
}

export function setLoadingComment(tLC) {
    loadingComment = tLC;
}

export function getNestedLevel() {
    return nLevel;
}

export function setNestedLevel(tNl) {
    nLevel = tNl;
}

export function getNestedText() {
    return nText;
}

export function setNestedText(tNt) {
    nText = tNt;
}

export function getNestedName() {
    return nName;
}

export function setNestedName(tNn) {
    nName = tNn;
}