
//Рендер комментариев
export function renderCommentators(listElement, users, cbEdit, cbEvent, cdReplay) {
    const userHTML = users.map((user, index) => {
        return `<li class="comment" data-index=${index}>
    <div class="comment-header">
      <div>${user.name}</div>
      <div>${user.date}</div>
    </div>
    <div class="comment-body">
      <div class="comment-text">
      ${user.nestingLevel === 0 ? ''.trim() : user.textReply.replaceAll("QUOTE_BEGIN", "<div class='quote'>").replaceAll("QUOTE_END", "</div>")}
      ${user.isEdit ? `<textarea type="textarea" class="add-form-text edit-comment" placeholder="Введите ваш коментарий" rows="4" id="comment-edit">${user.text}</textarea>` : user.text}
      </div>
    </div>
    <div class="comment-footer">
    <button class="button-edit-comment" data-index=${index} ${user.otherEdit ? 'disabled' : ''}>${user.isEdit ? 'Сохранить' : 'Редактировать'}</button>
      <div class="likes">
        <span class="likes-counter">${user.likes}</span>
        <button class="like-button ${user.likesLoading ? '-loading-like' : ''} ${user.likesFlag ? '-active-like' : ''}" data-index=${index}></button>
      </div>
    </div>
  </li>`
    }).join('');
    listElement.innerHTML = userHTML;
    cbEdit();
    cbEvent();
    cdReplay();
}

export function renderAddForm(addFormElement) {
    const addFormHTML = ` 
    <input type="text" class="add-form-name" placeholder="Введите ваше имя" id="name-input" />
    <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий"}" rows="4"
      id="text-input"></textarea>
      <div class="add-form-row" id="add-form-row">
      <button class="shutdown add-form-button" id="cansel-form-button">Отменить</button>
      <button class="add-form-button" id="add-form-button">Написать</button>
    </div>`;
    addFormElement.innerHTML = addFormHTML;
}