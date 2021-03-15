function createHtmlElement(item, Class, value) {
  const element = document.createElement(item);
  if (typeof Class === 'object') {
    for (let i = 0; i < Class.length; i++) {
      element.classList.add(Class[i]);
    }
  } else {
    element.classList.add(Class);
  }
  element.textContent = value;

  return element;
}

function createAppTitle(title) {
  let appTitle = createHtmlElement('h2', false, title);
  return appTitle;
}

function createTodoItemForm() {
  let form = createHtmlElement('form', ['input-group', 'mb-3']);
  let input = createHtmlElement('input', 'form-control');
  let buttonWrapper = createHtmlElement('div', 'input-group-append');
  let submitBtn = createHtmlElement('button', ['btn', 'btn-primary'], 'Добавить дело');

  input.placeholder = 'Введите новое дело';

  buttonWrapper.append(submitBtn);
  form.append(input);
  form.append(buttonWrapper);

  return {
    form,
    input,
    submitBtn,
  };
}

function createTodoList() {
  let list = createHtmlElement('ul', 'list-group');
  return list;
}

function createTodoItem(content, done) {
  let item = createHtmlElement('li', ['list-group-item', 'd-flex', 'align-items-center', 'justify-content-between']);
  let span = createHtmlElement('span', false, content);
  let buttonGroup = createHtmlElement('div', ['btn-group', 'btn-group-sm']);
  let doneButton = createHtmlElement('button', ['btn', 'btn-success'], 'Сделано');
  let deletedButton = createHtmlElement('button', ['btn', 'btn-danger'], 'Удалить');

  if (done) {
    item.classList.add('list-group-item-success')
  }

  buttonGroup.append(doneButton);
  buttonGroup.append(deletedButton);
  item.append(span);
  item.append(buttonGroup);

  return {
    item,
    doneButton,
    deletedButton,
  }
}

function disableBtn(input, btn) {
  btn.setAttribute('disabled', '');

  document.addEventListener('input', function () {
    if (!input.value) {
      btn.setAttribute('disabled', '');
    } else {
      btn.removeAttribute('disabled', '');
    }
  });
}

function createStorageList(storageList, screenList) {
  let listItemArr = []
  for (let item of storageList) {
    let listItem = createTodoItem(item.name, item.done);
    listItemArr.push(listItem);
    screenList.append(listItem.item);
  }
  return listItemArr;
}

function createObject(value, boolean = false) {
  let obj = {
    name: value,
    done: boolean,
  }
  return obj;
}

function reloadStorageList(id, string) {
  localStorage.removeItem(id);
  localStorage.setItem(id, string);
}

function manageListItem(id, array, item) {
  let list = [];
  if (Array.isArray(item)) {
    list = item;
  } else {
    list.push(item);
  }

  list.forEach(element => element.doneButton.addEventListener('click', function () {
    element.item.classList.toggle('list-group-item-success');

    let text = element.item.querySelector('span').innerText;

    array.forEach(e => {
      if (e.name == text) {
        if (e.done == true) {
          e.done = false;
        } else {
          e.done = true;
        }
      }
    });

    reloadStorageList(id, JSON.stringify(array))
  }));

  list.forEach(element => element.deletedButton.addEventListener('click', function () {
    let text = element.item.querySelector('span').innerText;

    if (confirm('Вы уверены что хотите удалить дело?')) {
      array.forEach(e => {
        if (e.name == text) {
          array.splice(array.indexOf(e), 1);
        }
      });
      reloadStorageList(id, JSON.stringify(array))
      element.item.remove();
    }
  }));
}


function createTodoApp(id, listName, array) {
  let container = document.getElementById(id);

  let todoAppTitle = createAppTitle(listName);
  let todoItemForm = createTodoItemForm();
  let todoList = createTodoList();


  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  disableBtn(todoItemForm.input, todoItemForm.submitBtn);

  let storageList = createStorageList(array, todoList);
  manageListItem(id, array, storageList);

  todoItemForm.form.addEventListener('submit', function (e) {
    e.preventDefault();

    disableBtn(todoItemForm.input, todoItemForm.submitBtn);

    let todoItem = createTodoItem(todoItemForm.input.value);
    let obj = createObject(todoItemForm.input.value);
    todoItemForm.input.value = '';
    todoList.append(todoItem.item);
    array.push(obj);

    localStorage.setItem(id, JSON.stringify(array));
    manageListItem(id, array, todoItem);
  });
}

window.createTodoApp = createTodoApp;
