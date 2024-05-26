import {
  shutdownElement,
  openElement,
  delayPromise,
} from "./common.js";
import {
  closeAuthorization,
  entranceAuthorization,
  regEntAuthorization,
  registrationAuthorization,
  setAuthorizationFormElement,
  getRegistration,
  goToRegEnt,
  getAuthorized,
  getAuthorizationFormElement,
} from "./authorization.js";

const initTextAreaEdit = () => {
  const textEdits = document.getElementById('comment-edit');
  textEdits.addEventListener('click', (event) => {
    event.stopPropagation();
  });
}

//Обработчик лайков
const initEventListenders = (listElement, nL, nT, nN, tUsers) => {
  const likeButtonsElements = document.querySelectorAll('.like-button');
  for (let likeButtonElement of likeButtonsElements)
    likeButtonElement.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!getAuthorized()) {
        const headerAuthorizationElement = document.getElementById("header");
        const containerComments = document.getElementById("container");
        shutdownElement(headerAuthorizationElement);
        containerComments.classList.add('blur');
        openElement(getAuthorizationFormElement());
        return;
      }
      let tIndex = likeButtonElement.dataset.index;
      tUsers[tIndex].likesLoading = true;
      renderCommentators(listElement, tUsers, nL, nT, nN);
      delayPromise(2000)
        .then(() => {
          if (tUsers[tIndex].likesFlag) {
            tUsers[tIndex].likes--;
            tUsers[tIndex].likesFlag = false;
          } else {
            tUsers[tIndex].likes++;
            tUsers[tIndex].likesFlag = true;
          }
          tUsers[tIndex].likesLoading = false;
          renderCommentators(listElement, tUsers, nL, nT, nN);
        })
    })
}

//Обработчик изменения коммнетария
const initEditCommentButtons = (listElement, nL, nT, nN, tUsers) => {
  const buttonsEditComment = document.querySelectorAll('.button-edit-comment');
  const textEdits = document.getElementById('comment-edit');
  for (let buttonEditComment of buttonsEditComment) {
    buttonEditComment.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!getAuthorized()) {
        const headerAuthorizationElement = document.getElementById("header");
        const containerComments = document.getElementById("container");
        shutdownElement(headerAuthorizationElement);
        containerComments.classList.add('blur');
        openElement(getAuthorizationFormElement());
        return;
      }
      let tIndex = buttonEditComment.dataset.index;
      if (tUsers[tIndex].isEdit) {
        tUsers[tIndex].text = textEdits.value;
        tUsers[tIndex].isEdit = false;
        for (let otherButtons of buttonsEditComment) {
          if (otherButtons.dataset.index != tIndex)
            tUsers[otherButtons.dataset.index].otherEdit = false;
        }
        renderCommentators(listElement, tUsers, nL, nT, nN);
      } else {
        tUsers[tIndex].isEdit = true;
        for (let otherButtons of buttonsEditComment) {
          if (otherButtons.dataset.index != tIndex)
            tUsers[otherButtons.dataset.index].otherEdit = true;
        }
        renderCommentators(listElement, tUsers, nL, nT, nN);
        initTextAreaEdit();
      }
    })
  }
}

//Обработчик ответа на комментарий
const initReplyComment = (nL, nT, nN, tUsers) => {
  const replyComments = document.querySelectorAll('.comment');
  const canselBattonElement = document.getElementById('cansel-form-button');
  const addFormRow = document.getElementById('add-form-row');
  const textInputElement = document.getElementById('text-input');
  canselBattonElement.addEventListener('click', () => {
    nL = 0;
    nT = '';
    nN = '';
    textInputElement.placeholder = `Введите ваш комментарий`;
    textInputElement.value = '';
    shutdownElement(canselBattonElement);
    addFormRow.classList.add('add-form-row');
    addFormRow.classList.remove('add-form-row-box');
  })
  for (let replyComment of replyComments) {
    let tIndex = replyComment.dataset.index;
    replyComment.addEventListener('click', (event) => {
      nL = tUsers[tIndex].nestingLevel + 1;
      nT = `${tUsers[tIndex].text}\n\tот ${tUsers[tIndex].name}`;
      nN = tUsers[tIndex].name;

      openElement(canselBattonElement);
      addFormRow.classList.remove('add-form-row');
      addFormRow.classList.add('add-form-row-box');
      textInputElement.placeholder = `Введите ваш ответ пользователю ${nN}`;
    })
  }
}

//Рендер комментариев
export function renderCommentators(listElement, tUsers, nL, nT, nN) {
  const userHTML = tUsers.map((user, index) => {
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
  initEventListenders(listElement, nL, nT, nN, tUsers);
  initEditCommentButtons(listElement, nL, nT, nN, tUsers);
  initReplyComment(nL, nT, nN, tUsers);
}

//Рендер форма добавления комментария
export function renderAddForm(addFormElement) {
  const addFormHTML = ` 
    <input type="text" class="add-form-name" placeholder="Введите ваше имя" id="name-input" disabled/>
    <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий"}" rows="4"
      id="text-input"></textarea>
      <div class="add-form-row" id="add-form-row">
      <button class="shutdown add-form-button" id="cansel-form-button">Отменить</button>
      <button class="add-form-button" id="add-form-button">Написать</button>
    </div>`;
  addFormElement.innerHTML = addFormHTML;
}

//Рендер авторизации
export function renderAuthorizationForm(authorizationFormElement, addFormElement = null) {
  setAuthorizationFormElement(authorizationFormElement)
  const flagRegistration = getRegistration();
  const authorizationFormHTML = `
  <div class="authorization-box ">
      <div class="authorization-top-box">
        <button class=" authorization-regEnt" id="authorization-regEnt">
          ${flagRegistration ? 'Вход' : 'Зарегистрироваться'}
        </button>
        <button class=" authorization-close" id="authorization-close">
          Закрыть
        </button>
      </div>
      <span class="authorization-text">
          ${flagRegistration ? 'Регистрация' : 'Вход'}
      </span>
      <div class="authorization-input-box">
        <input type="text" class="authorization-login authorization-input" placeholder="Логин" id="login-input" />
        <input type="text" class="authorization-password authorization-input" placeholder="Пароль"
          id="password-input" />
      </div>
      <div class="authorization-button-box">
        <button class="authorization-regEntСonfirm" id="${flagRegistration ? 'authorization-registration' : 'authorization-entrance'}">
          ${flagRegistration ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </div>
    </div>`
  authorizationFormElement.innerHTML = authorizationFormHTML;
  const authorizationCloseButton = document.getElementById("authorization-close");
  const headerAuthorizationElement = document.getElementById("header");
  const containerComments = document.getElementById("container");
  const authorizationElement = document.getElementById("authorization");
  const authorizationregEntButton = document.getElementById("authorization-regEnt");
  closeAuthorization(authorizationCloseButton, headerAuthorizationElement, authorizationElement, containerComments);
  flagRegistration ?
    registrationAuthorization() :
    entranceAuthorization(containerComments, authorizationElement, addFormElement);
  regEntAuthorization(authorizationregEntButton);
  goToRegEnt(headerAuthorizationElement, authorizationElement, containerComments);
}