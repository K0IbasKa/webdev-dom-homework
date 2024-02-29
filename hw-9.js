const buttonElement = document.getElementById('add-form-button');
const likeButtonElement = document.getElementById('like-button');
const nameInputElement = document.getElementById('name-input');
const textInputElement = document.getElementById('text-input');
const listElement = document.getElementById('list');
const deleteButtonElement = document.getElementById('delete-button');

const disabledButton = (ti) => {
  buttonElement.removeAttribute('disabled');
  buttonElement.classList.remove('disabled');
  if (ti.target.value.trim() === '') {
    buttonElement.setAttribute('disabled', '');
    buttonElement.classList.add('disabled');
  }
}
const enterInput = (ti) => {
  if (ti.code === 'Enter')
    buttonElement.click();
}
nameInputElement.addEventListener('input', disabledButton);
textInputElement.addEventListener('input', disabledButton);

nameInputElement.addEventListener('keyup', enterInput);
textInputElement.addEventListener('keyup', enterInput);

buttonElement.addEventListener('click', () => {
  nameInputElement.classList.remove('error');
  textInputElement.classList.remove('error');
  if (nameInputElement.value.trim() === '') {
    nameInputElement.classList.add('error');
    return;
  }
  if (textInputElement.value.trim() === '') {
    textInputElement.classList.add('error');
    return;
  }
  const oldElement = listElement.innerHTML;
  listElement.innerHTML = oldElement +
    `<li class="comment">
        <div class="comment-header">
          <div>${nameInputElement.value.trim()}</div>
          <div>${(new Date().getDate() < 10 ? '0' + (new Date().getDate()) : new Date().getDate()) + '.'
    + (new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + '.'
    + new Date().getFullYear() + ' '
    + (new Date().getHours() < 10 ? '0' + (new Date().getHours()) : new Date().getHours()) + ':'
    + (new Date().getMinutes() < 10 ? '0' + (new Date().getMinutes()) : new Date().getMinutes()) + ':'
    + (new Date().getSeconds() < 10 ? '0' + (new Date().getSeconds()) : new Date().getSeconds())}
        </div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
          ${textInputElement.value.trim()}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">0</span>
            <button class="like-button"></button>
          </div>
        </div>
      </li>`
  nameInputElement.value = '';
  textInputElement.value = '';
})

deleteButtonElement.addEventListener('click', () => {
  listElement.innerHTML = listElement.innerHTML.slice(0, listElement.innerHTML.lastIndexOf(`<li class="comment">`));
})