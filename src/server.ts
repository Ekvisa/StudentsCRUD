import express from "express";
const app = express();
import fs from "node:fs/promises";
import path from "node:path";
const port = 3004;

const __dirname = import.meta.dirname;
console.log(__dirname);

app.use(express.json());

app.get("/", async (req, res) => {
  res.sendFile("./home.html", { root: "./src" });
});

function getPath(file: string) {
  const pathToFile = path.join(__dirname, file);
  console.log(pathToFile);
  return pathToFile;
}

async function getStudents() {
  const jsonFile = await fs.readFile(getPath("db.json"), "utf8");
  return JSON.parse(jsonFile);
}

async function setStudents(file: Object[]) {
  const jsonFile = await fs.writeFile(
    getPath("db.json"),
    JSON.stringify(file),
    "utf8",
  );
}

app
  .route("/students")
  .get(async (req, res) => {
    const students: IStudent[] = await getStudents();
    res.json(students);
  })
  .post(async (req, res) => {
    console.log(req.body);
    const students: IStudent[] = await getStudents();
    req.body.id = Date.now();
    students.push(req.body);
    console.log(students);
    await setStudents(students);
    // res.sendStatus(201); - ?
    res.status(201).json(req.body);
  })
  .put(async (req, res) => {
    console.log(req.body);
    const students: IStudent[] = await getStudents();
    // let changedStudent = students.find((student) => (student.id = req.body.id));
    let changedStudentIndex = students.findIndex(
      (student) => student.id === req.body.id,
    );
    if (changedStudentIndex === -1) return res.sendStatus(404);
    students[changedStudentIndex] = req.body;
    // students.splice(changedStudentIndex, 1, req.body);

    console.log(students);
    await setStudents(students);
    res.status(200).json(req.body);
  });

interface IStudent {
  id: number;
  name: string;
  gender: string;
  physics: number;
  maths: number;
  english: number;
}

app.delete("/students/:id", async (req, res) => {
  //   console.log(req.params.id);
  let students: IStudent[] = await getStudents();
  students = students.filter(
    (student: IStudent) => student.id !== +req.params.id,
  );
  await setStudents(students);
  res.sendStatus(204);
});

// app.delete("/students/:id", async (req, res) => {
//   console.log("app.delete");
//   const students = await getStudents();
//   const id = Number(req.params.id);
//   //   const filtered = students.filter((s) => s.id !== id);
//   //   await setStudents(filtered);

//   //   res.sendStatus(204);
//   console.log(`${students}, ${id}`);
// });

app.use(express.static("./src"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// app.get("/users/:id", (req, res) => {});
