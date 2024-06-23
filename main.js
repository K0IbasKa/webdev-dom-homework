import {
  format,
} from "date-fns"
import {
  toLocalDate,
  secureInput,
} from "./modules/commentProcessing.js";
import {
  getCommentData,
  postCommentData,
} from './modules/api.js';
import {
  shutdownElement,
  openElement,
  deleteLastComment,
  getLoadingComment,
  setLoadingComment,
  hidingAddingElement,
} from "./modules/common.js";
import {
  renderCommentators,
  renderAddForm,
  renderAuthorizationForm,
} from "./modules/render.js"
import {
  getAuthorized,
  getName,
} from "./modules/authorization.js"
const listElement = document.getElementById('list');
const deleteLastElementButton = document.getElementById('delete-last-button');
const addFormElement = document.getElementById('add-form');
const authorizationFormElement = document.getElementById('authorization');
const commnetsUpdateElement = document.getElementById('update-comments');
const commentAddingElement = document.getElementById('add-comment');
const noCommentElement = document.getElementById('no-comments');
let buttonElement;
let nameInputElement;
let textInputElement;
let nLevel = 0; // уровень вложенности (думал как-то сделать, но не придумал)
let nText = ''; // текст комментария, на который отвечают
let nName = ''; // Имя пользомателя, которомк отвечают

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

const receivingCommentData = () => {
  renderAuthorizationForm(authorizationFormElement, addFormElement);
  buttonElement = document.getElementById('add-form-button');
  nameInputElement = document.getElementById('name-input');
  textInputElement = document.getElementById('text-input');
  getCommentData()
    .catch(() => {
      buttonElement.classList.remove('disabled');
    })
    .then((responseData) => {
      users = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: format(new Date(comment.date), "yyyy-MM-dd hh.mm.ss"),
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
      if (!getLoadingComment()) {
        shutdownElement(commentAddingElement);
        setLoadingComment(true);
      }
      if (users.length === 0) {
        openElement(noCommentElement);
      } else {
        renderCommentators(listElement, users, nLevel, nText, nName);
        deleteLastComment(listElement, users, nLevel, nText, nName, deleteLastElementButton)
      }
    })
}

receivingCommentData();

const disabledButton = (ti) => {
  buttonElement.removeAttribute('disabled');
  buttonElement.classList.remove('disabled');
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

textInputElement.addEventListener('input', disabledButton);

textInputElement.addEventListener('keyup', enterInput);

buttonElement.addEventListener('click', () => {
  if (!getAuthorized()) {
    const headerAuthorizationElement = document.getElementById("header");
    const containerComments = document.getElementById("container");
    shutdownElement(headerAuthorizationElement);
    containerComments.classList.add('blur');
    openElement(authorizationFormElement);
    return;
  }
  textInputElement.classList.remove('error');
  if (textInputElement.value.trim() === '') {
    textInputElement.classList.add('error');
    return;
  }

  if (getLoadingComment()) {
    openElement(commentAddingElement);
    setLoadingComment(false);
  }
  //const currentDate = new Date();
  buttonElement.classList.add('disabled');
  buttonElement.setAttribute('disabled', '');

  postCommentData(
    secureInput(nameInputElement.value),
    secureInput(textInputElement.value)
  )
    .catch(() => {
      hidingAddingElement(commentAddingElement);
      alert('Ошибка соединения, попробуйте позже!');
      return Promise.reject('Ошибка соединения!');
    })
    .then((response) => {
      switch (response.status) {
        case 201:
          return receivingCommentData();
        case 400:
          hidingAddingElement(commentAddingElement);
          alert('Имя и комментарий должны быть не меньше 3-х симолов');
          return Promise.reject('Ошибка ввода!');
        case 500:
          hidingAddingElement(commentAddingElement);
          buttonElement.click();
        default:
          return Promise.reject('Ошибка');
      }
    })
    .then(() => {
      textInputElement.value = '';
      buttonElement.classList.remove('disabled');
      buttonElement.removeAttribute('disabled');
    })
    .catch(() => {
      buttonElement.classList.remove('disabled');
    })
  nLevel = 0;
})