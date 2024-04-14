export const state = {
    ON: 'on',
    OFF: 'off',
}

//Задержка ответа сервера
export function delayPromise(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}

//Закрыть элемент
export function shutdownElement(tElement) {
    tElement.classList.add('shutdown');
}

//Открыть Элемент 
export function openElement(tElement) {
    tElement.classList.remove('shutdown');
}