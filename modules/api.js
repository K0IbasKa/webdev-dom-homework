//Получить данные от API
export function getCommentData() {
    return fetch("https://wedev-api.sky.pro/api/v1/ivan-uskov/comments")
        .catch(() => {
            hidingAddingElement();
            alert('Ошибка соединения, попробуйте позже!');
            return Promise.reject('Ошибка соединения!');
        })
        .then((response) => {
            switch (response.status) {
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
    return fetch("https://wedev-api.sky.pro/api/v1/ivan-uskov/comments",
        {
            method: "POST",
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