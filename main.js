import {
  toLocalDate,
  secureInput,
} from "./modules/commentProcessing.js";
import {
  getCommentData,
  postCommentData,
} from './modules/api.js';
import {
  delayPromise,
  shutdownElement,
  openElement,
} from "./modules/common.js";
import {
  renderCommentators,
  renderAddForm,
} from "./modules/render.js"
const listElement = document.getElementById('list');
const deleteLastElementButton = document.getElementById('delete-last-button');
const addFormElement = document.getElementById('add-form');
const commnetsUpdateElement = document.getElementById('update-comments');
const commentAddingElement = document.getElementById('add-comment');
const noCommentElement = document.getElementById('no-comments');
let nLevel = 0; // уровень вложенности (думал как-то сделать, но не придумал)
let nText = ''; // текст комментария, на который отвечают
let nName = ''; // Имя пользомателя, которомк отвечают
let loadingComment = true; // Прогрузка комментария

let users = [
  /*{
    name: 'Глеб Фокин',
    date: '12.02.22 12:18',
    text: 'Это будет первый комментарий на этой странице',
    textReply: '',
    likes: 3,
    likesFlag: false,
    isEdit: false,
    otherEdit: false,
    nestingLevel: 0
  },*/
];

renderAddForm(addFormElement);

// Скрыть элемент загрузки комментария
const hidingAddingElement = () => {
  shutdownElement(commentAddingElement);
  loadingComment = true;
}

const receivingCommentData = () => {
  getCommentData()
    .catch(() => {
      buttonElement.classList.remove('disabled');
    })
    .then((responseData) => {
      users = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: toLocalDate(new Date(comment.date)),
          text: comment.text,
          textReply: '',
          likes: comment.likes,
          likesFlag: comment.isLiked,
          likesLoading: false,
          isEdit: false,
          otherEdit: false,
          nestingLevel: 0
        }
      });
    })
    .then(() => {
      shutdownElement(commnetsUpdateElement)
      if (!loadingComment) {
        shutdownElement(commentAddingElement);
        loadingComment = true;
      }
      if (users.length === 0) {
        openElement(noCommentElement);
      } else {
        renderCommentators(listElement, users, initEditCommentButtons, initEventListenders, initReplyComment);
      }
    })
}

const buttonElement = document.getElementById('add-form-button');
const nameInputElement = document.getElementById('name-input');
const textInputElement = document.getElementById('text-input');

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

  if (loadingComment) {
    openElement(commentAddingElement);
    loadingComment = false;
  }
  //const currentDate = new Date();
  buttonElement.classList.add('disabled');

  postCommentData(
    secureInput(nameInputElement.value),
    secureInput(textInputElement.value)
  )
    .catch(() => {
      hidingAddingElement();
      alert('Ошибка соединения, попробуйте позже!');
      return Promise.reject('Ошибка соединения!');
    })
    .then((response) => {
      switch (response.status) {
        case 201:
          return receivingCommentData();
        case 400:
          hidingAddingElement();
          alert('Имя и комментарий должны быть не меньше 3-х симолов');
          return Promise.reject('Ошибка ввода!');
        case 500:
          hidingAddingElement();
          buttonElement.click();
        default:
          return Promise.reject('Ошибка');
      }
    })
    .then(() => {
      nameInputElement.value = '';
      textInputElement.value = '';
    })
    .catch(() => {
      buttonElement.classList.remove('disabled');
    })
  nLevel = 0;
})

const initReplyComment = () => {
  const replyComments = document.querySelectorAll('.comment');
  const canselBattonElement = document.getElementById('cansel-form-button');
  const addFormRow = document.getElementById('add-form-row');
  canselBattonElement.addEventListener('click', () => {
    nLevel = 0;
    nText = '';
    nName = '';
    textInputElement.placeholder = `Введите ваш комментарий`;
    textInputElement.value = '';
    shutdownElement(canselBattonElement);
    addFormRow.classList.add('add-form-row');
    addFormRow.classList.remove('add-form-row-box');
  })
  for (let replyComment of replyComments) {
    let tIndex = replyComment.dataset.index;
    replyComment.addEventListener('click', (event) => {
      nLevel = users[tIndex].nestingLevel + 1;
      nText = `${users[tIndex].text}\n\tот ${users[tIndex].name}`;
      nName = users[tIndex].name;

      openElement(canselBattonElement);
      addFormRow.classList.remove('add-form-row');
      addFormRow.classList.add('add-form-row-box');
      textInputElement.placeholder = `Введите ваш ответ пользователю ${nName}`;
    })
  }
}

const initEventListenders = () => {
  const likeButtonsElements = document.querySelectorAll('.like-button');
  for (let likeButtonElement of likeButtonsElements)
    likeButtonElement.addEventListener('click', (event) => {
      event.stopPropagation();
      let tIndex = likeButtonElement.dataset.index;
      users[tIndex].likesLoading = true;
      renderCommentators(listElement, users, initEditCommentButtons, initEventListenders, initReplyComment);
      delayPromise(2000)
        .then(() => {
          if (users[tIndex].likesFlag) {
            users[tIndex].likes--;
            users[tIndex].likesFlag = false;
          } else {
            users[tIndex].likes++;
            users[tIndex].likesFlag = true;
          }
          users[tIndex].likesLoading = false;
          renderCommentators(listElement, users, initEditCommentButtons, initEventListenders, initReplyComment);
        })
    })
}

const initTextAreaEdit = () => {
  const textEdits = document.getElementById('comment-edit');
  textEdits.addEventListener('click', (event) => {
    event.stopPropagation();
  });
}

const initEditCommentButtons = () => {
  const buttonsEditComment = document.querySelectorAll('.button-edit-comment');
  const textEdits = document.getElementById('comment-edit');
  for (let buttonEditComment of buttonsEditComment) {
    buttonEditComment.addEventListener('click', (event) => {
      event.stopPropagation();
      let tIndex = buttonEditComment.dataset.index;
      if (users[tIndex].isEdit) {
        users[tIndex].text = textEdits.value;
        users[tIndex].isEdit = false;
        for (let otherButtons of buttonsEditComment) {
          if (otherButtons.dataset.index != tIndex)
            users[otherButtons.dataset.index].otherEdit = false;
        }
        renderCommentators(listElement, users, initEditCommentButtons, initEventListenders, initReplyComment);
      } else {
        users[tIndex].isEdit = true;
        for (let otherButtons of buttonsEditComment) {
          if (otherButtons.dataset.index != tIndex)
            users[otherButtons.dataset.index].otherEdit = true;
        }
        renderCommentators(listElement, users, initEditCommentButtons, initEventListenders, initReplyComment);
        initTextAreaEdit();
      }
    })
  }
}

deleteLastElementButton.addEventListener('click', (event) => {
  event.stopPropagation();
  listElement.innerHTML = listElement.innerHTML.slice(0, listElement.innerHTML.lastIndexOf(`< li class="comment" > `));
  users.pop();
  renderCommentators(listElement, users, initEditCommentButtons, initEventListenders, initReplyComment);
});

receivingCommentData();