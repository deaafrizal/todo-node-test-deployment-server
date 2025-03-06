const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;
const dataFilePath = 'tasks.json';

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function readTasks() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));
}

app.get('/', (req, res) => {
  const tasks = readTasks();
  res.render('index', { tasks: tasks });
});

app.post('/tasks', (req, res) => {
  const tasks = readTasks();
  tasks.push({ text: req.body.task, completed: false });
  writeTasks(tasks);
  res.redirect('/');
});

app.post('/complete/:index', (req, res) => {
  const tasks = readTasks();
  const index = parseInt(req.params.index);
  if (index >= 0 && index < tasks.length) {
    tasks[index].completed = true;
    writeTasks(tasks);
  }
  res.redirect('/');
});

app.post('/delete/:index', (req, res) => {
  const tasks = readTasks();
  const index = parseInt(req.params.index);
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    writeTasks(tasks);
  }
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});