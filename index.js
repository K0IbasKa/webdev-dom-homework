const buttonElement = document.getElementById('add-form-button');
const nameInputElement = document.getElementById('name-input');
const textInputElement = document.getElementById('text-input');
const listElement = document.getElementById('list');
const deleteLastElementButton = document.getElementById('delete-last-button');

const users = [
  {
    name: 'Глеб Фокин',
    date: '12.02.22 12:18',
    text: 'Это будет первый комментарий на этой странице',
    likes: 3,
    likesFlag: false,
    isEdit: false,
    otherEdit: false
  },
  {
    name: 'Варвара Н.',
    date: '13.02.22 19:22',
    text: 'Мне нравится как оформлена эта страница! ❤',
    likes: 75,
    likesFlag: true,
    isEdit: false,
    otherEdit: false
  }
]

const disabledButton = (ti) => {
  buttonElement.removeAttribute('disabled');
  buttonElement.classList.remove('disabled');
  nameInputElement.classList.remove('error');
  textInputElement.classList.remove('error');
  if (ti.target.value.trim() === '') {
    buttonElement.setAttribute('disabled', '');
    buttonElement.classList.add('disabled');
  }
}

const renderCommentators = () => {
  const userHTML = users.map((user, index) => {
    return `<li class="comment" >
  <div class="comment-header">
    <div>${user.name}</div>
    <div>${user.date}</div>
  </div>
  <div class="comment-body">
    <div class="comment-text">
    ${user.isEdit ? `<textarea type="textarea" class="add-form-text edit-comment" placeholder="Введите ваш коментарий" rows="4" id="comment-edit">${user.text}</textarea>` : user.text}
    </div>
  </div>
  <div class="comment-footer">
  <button class="button-edit-comment" data-index=${index} ${user.otherEdit ? 'disabled' : ''}>${user.isEdit ? 'Сохранить' : 'Редактировать'}</button>
    <div class="likes">
      <span class="likes-counter">${user.likes}</span>
      <button class="like-button ${user.likesFlag ? '-active-like' : ''}" data-index=${index}></button>
    </div>
  </div>
</li>`}).join('');
  listElement.innerHTML = userHTML;
  initEditCommentButtons();
  initEventListenders();
}

const initEventListenders = () => {
  const likeButtonsElements = document.querySelectorAll('.like-button');
  for (let likeButtonElement of likeButtonsElements)
    likeButtonElement.addEventListener('click', () => {
      let tIndex = likeButtonElement.dataset.index;
      if (users[tIndex].likesFlag) {
        users[tIndex].likes--;
        users[tIndex].likesFlag = false;
      } else {
        users[tIndex].likes++;
        users[tIndex].likesFlag = true;
      }
      renderCommentators();
    })
}

const initEditCommentButtons = () => {
  const buttonsEditComment = document.querySelectorAll('.button-edit-comment');
  const textEdits = document.getElementById('comment-edit');
  for (let buttonEditComment of buttonsEditComment) {
    buttonEditComment.addEventListener('click', () => {
      let tIndex = buttonEditComment.dataset.index;
      if (users[tIndex].isEdit) {
        users[tIndex].text = textEdits.value;
        users[tIndex].isEdit = false;
        for (let otherButtons of buttonsEditComment) {
          if (otherButtons.dataset.index != tIndex)
            users[otherButtons.dataset.index].otherEdit = false;
        }
      } else {
        users[tIndex].isEdit = true;
        for (let otherButtons of buttonsEditComment) {
          if (otherButtons.dataset.index != tIndex)
            users[otherButtons.dataset.index].otherEdit = true;
        }
      }
      renderCommentators();
    })
  }
}

renderCommentators();

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

  const currentDate = new Date();
  users.push({
    name: nameInputElement.value,
    date: (currentDate.getDate() < 10 ? '0' + (currentDate.getDate()) : currentDate.getDate()) + '.'
      + (currentDate.getMonth() < 9 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1) + '.'
      + currentDate.getFullYear() + ' '
      + (currentDate.getHours() < 10 ? '0' + (currentDate.getHours()) : currentDate.getHours()) + ':'
      + (currentDate.getMinutes() < 10 ? '0' + (currentDate.getMinutes()) : currentDate.getMinutes()) + ':'
      + (currentDate.getSeconds() < 10 ? '0' + (currentDate.getSeconds()) : currentDate.getSeconds()),
    text: textInputElement.value,
    likes: 0,
    likesFlag: false,
    isEdit: false,
    otherEdit: false
  })

  renderCommentators();

  nameInputElement.value = '';
  textInputElement.value = '';
})

deleteLastElementButton.addEventListener('click', () => {
  listElement.innerHTML = listElement.innerHTML.slice(0, listElement.innerHTML.lastIndexOf(`<li class="comment">`));
  users.pop();
  renderCommentators();
})