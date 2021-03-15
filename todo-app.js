function createAppTitle(title) {
  let appTitle = document.createElement('h2');
  appTitle.innerHTML = title;
  return appTitle;
}

function createTodoItemForm() {
  let form = document.createElement('form');
  let input = document.createElement('input');
  let buttonWrapper = document.createElement('div');
  let submitBtn = document.createElement('button');

  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = 'Введите новое дело';
  buttonWrapper.classList.add('input-group-append');
  submitBtn.classList.add('btn', 'btn-primary');
  submitBtn.textContent = 'Добавить дело';

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
  let list = document.createElement('ul');
  list.classList.add('list-group');
  return list;
}

function createTodoItem(content, done) {
  let item = document.createElement('li');
  let span = document.createElement('span');
  let buttonGroup = document.createElement('div');
  let doneButton = document.createElement('button');
  let deletedButton = document.createElement('button');

  item.classList.add('list-group-item', 'd-flex', 'align-items-center', 'justify-content-between');
  if (done) {
    item.classList.add('list-group-item-success')
  }

  span.innerText = content;

  buttonGroup.classList.add('btn-group', 'btn-group-sm')
  doneButton.classList.add('btn', 'btn-success');
  doneButton.innerHTML = 'Сделано';
  deletedButton.classList.add('btn', 'btn-danger');
  deletedButton.innerHTML = 'Удалить';

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
  for (let item of storageList) {
    let listItem = createTodoItem(item.name, item.done);
    screenList.append(listItem.item);
  }
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


function createTodoApp(id, listName, array) {
  let container = document.getElementById(id);

  let todoAppTitle = createAppTitle(listName);
  let todoItemForm = createTodoItemForm();
  let todoList = createTodoList();


  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  disableBtn(todoItemForm.input, todoItemForm.submitBtn);

  createStorageList(array, todoList);

  todoItemForm.form.addEventListener('submit', function (e) {
    e.preventDefault();

    disableBtn(todoItemForm.input, todoItemForm.submitBtn);

    let todoItem = createTodoItem(todoItemForm.input.value);
    let obj = createObject(todoItemForm.input.value);
    todoItemForm.input.value = '';
    todoList.append(todoItem.item);

    array.push(obj);
    console.log(array);
    localStorage.setItem(id, JSON.stringify(array));

    todoItem.doneButton.addEventListener('click', function () {
      todoItem.item.classList.toggle('list-group-item-success');

      let text = todoItem.item.querySelector('span').innerText;

      array.forEach(e => {
        if (e.name == text && e.done == false) {
          e.done = true;
        } else {
          e.done = false;
        }
      });

      reloadStorageList(id, JSON.stringify(array));
    });

    todoItem.deletedButton.addEventListener('click', function (){
      let text = todoItem.item.querySelector('span').innerText;

      if (confirm('Вы уверены что хотите удалить дело?')) {
        array.forEach(e => {
          if (e.name == text) {
            array.splice(e, 1);
          }
        });

        todoItem.item.remove();
      }

      reloadStorageList(id, JSON.stringify(array));
    });

  });

  let li = document.querySelectorAll('li');

  li.forEach(element => element.querySelector('.btn-success').addEventListener('click', function () {
    element.classList.toggle('list-group-item-success');

    let text = element.querySelector('span').innerText;

    array.forEach(e => {
      if (e.name == text && e.done == false) {
        e.done = true;
      } else {
        e.done = false;
      }
    });

    reloadStorageList(id, JSON.stringify(array))
  }));

  li.forEach(element => element.querySelector('.btn-danger').addEventListener('click', function () {
    let text = element.querySelector('span').innerText;

    if (confirm('Вы уверены что хотите удалить дело?')) {
      array.forEach(e => {
        if (e.name == text) {
          array.splice(e, 1);
        }
      });

      element.remove();
    }

    reloadStorageList(id, JSON.stringify(array))
  }));
}


window.createTodoApp = createTodoApp;





