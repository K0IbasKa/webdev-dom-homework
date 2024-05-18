// Формат времени
export function toLocalDate(date) {
    return (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '.'
        + (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.'
        + date.getFullYear() + ' '
        + (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
        + (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
        + (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
}

// Безопасный ввод полей
export function secureInput(textValue) {
    return textValue
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
}