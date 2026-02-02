const addBtn = document.querySelector("#addBtn");
const table = document.querySelector("#table");
const modal = document.querySelector("#modal");
const closeBtn = document.querySelector("#modal_close");

let editMode = false;
let currentId = 0;

function getData() {
  console.log("getData!");
  fetch("http://localhost:3004/students", { method: "GET" })
    .then((data) => data.json())
    .then((data) => {
      drawPage(data);
    });
}

function clearTable() {
  table.innerHTML = "";
}

function createEl(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(className);
  }
  element.textContent = text;
  return element;
}

function drawPage(arr) {
  console.log("drawPage");
  arr.forEach((student) => {
    const div = createEl("div", "table_item");
    const name = createEl("p", "", student.name);
    const gender = createEl("p", "", student.gender);
    const physics = createEl("p", "", student.physics);
    const maths = createEl("p", "", student.maths);
    const english = createEl("p", "", student.english);
    const button1 = createEl("button", "", "Edit");
    button1.addEventListener("click", () => {
      openModalToEditStudent(student);
    });
    const button2 = createEl("button", "", "Delete");
    button2.addEventListener("click", () => {
      actionsWithStudents(student.id, "DELETE");
    });
    div.append(name, gender, physics, maths, english, button1, button2);
    table.append(div);
    console.log("Page is drawn");
  });
}

getData();

const nameInp = document.querySelector("#name");
const genderInp = document.querySelector("#gender");
const physicsInp = document.querySelector("#physics");
const mathsInp = document.querySelector("#maths");
const englishInp = document.querySelector("#english");
const modalTitle = document.querySelector("#modalTitle");
const createBtn = document.querySelector("#create");

addBtn.addEventListener("click", () => {
  openModal();
  editMode = false;
  createBtn.textContent = "Create";
  modalTitle.textContent = "Create new student";
});

function closeModal() {
  modal.style.display = "none";
}

function openModal() {
  modal.style.display = "flex";
}

closeBtn.addEventListener("click", () => {
  closeModal();
});

createBtn.addEventListener("click", () => {
  checkData();
});

function openModalToEditStudent(student) {
  console.log("openModalToEditStudent");
  editMode = true;
  createBtn.textContent = "Change";
  modalTitle.textContent = "Change student";
  currentId = student.id;
  nameInp.value = student.name;
  genderInp.value = student.gender;
  physicsInp.value = student.physics;
  englishInp.value = student.english;
  mathsInp.value = student.maths;
  openModal();
}

function checkData() {
  const payload = {};
  payload.name = nameInp.value;
  payload.gender = genderInp.value;
  payload.physics = physicsInp.value;
  payload.maths = mathsInp.value;
  payload.english = englishInp.value;
  if (Object.values(payload).some((value) => !value)) {
    console.log("Please fill all fields");
    return;
  }
  if (editMode) {
    payload.id = currentId;
    actionsWithStudents(payload, "PUT");
  } else {
    actionsWithStudents(payload, "POST");
  }
  closeModal();
}

function actionsWithStudents(payload, method) {
  console.log("actionsWithStudents");
  let path = "http://localhost:3004/students";
  if (method === "DELETE") {
    path += `/${payload}`;
  }
  fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: method === "DELETE" ? null : JSON.stringify(payload),
  }).then((data) => {
    console.log(`${method} is in progress`);
    if (data.ok) {
      clearTable();
      getData();
      console.log(`${method} is done`);
    }
  });
}
