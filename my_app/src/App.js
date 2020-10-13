import React, { useState, useEffect  } from "react";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import { nanoid } from "nanoid";
//test

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);    

function App() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {

    const getGitHubUserWithFetch = async () => {
      const requestString = 'http://localhost:8000/'
      const response = await fetch(requestString, {
        "method": "GET"
      });
      const jsonData = await response.json();
      console.log(jsonData)
      setTasks(jsonData);
    };

    getGitHubUserWithFetch();
    console.log("didMount")
  }, []);

  const [filter, setFilter] = useState('All');

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton
    key={name}
    name={name}
    isPressed={name === filter}
    setFilter={setFilter}
  />
  ));



  const taskList = tasks
  .filter(task => FILTER_MAP[filter](task))
  .map(task => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
const headingText = `${taskList.length} ${tasksNoun} remaining`;

function addTask(name) {
  
  const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
  console.log(newTask)
  const postWithFetch = async () => {
    const requestString = 'http://localhost:8000/'
    const response = await fetch(requestString, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask)
    });
    const jsonData = await response.json();
    console.log(jsonData)
    // setTasks(jsonData);
  };

  postWithFetch();

 setTasks([...tasks, newTask]);

}

function toggleTaskCompleted(id) {
  const updatedTasks = tasks.map(task => {
    // if this task has the same ID as the edited task
    if (id === task.id) {
      // use object spread to make a new object
      // whose `completed` prop has been inverted
      return {...task, completed: !task.completed}
    }
    return task;
  });

  const editTask = updatedTasks.find(task => id === task.id);
  //console.log(editTask)
  const putWithFetch = async () => {
    const requestString = 'http://localhost:8000/'
    const response = await fetch(requestString, {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editTask)
    });
    const jsonData = await response.json();
    console.log(jsonData)
    // setTasks(jsonData);
  };

  putWithFetch();

  setTasks(updatedTasks);

}

function deleteTask(id) {
  const remainingTasks = tasks.filter(task => id !== task.id);

  
  const deletetWithFetch = async () => {
    const requestString = 'http://localhost:8000/'
    const response = await fetch(requestString, {
      method: 'DELETE', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id})
    });
    const jsonData = await response.json();
    console.log(jsonData)
    // setTasks(jsonData);
  };

  deletetWithFetch();

  setTasks(remainingTasks);
}

function editTask(id, newName) {
  const editedTaskList = tasks.map(task => {
  // if this task has the same ID as the edited task
    if (id === task.id) {
      //
      return {...task, name: newName}
    }
    return task;
  });
  const editTask = editedTaskList.find(task => id === task.id);
  //console.log(editTask)
  const putWithFetch = async () => {
    const requestString = 'http://localhost:8000/'
    const response = await fetch(requestString, {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editTask)
    });
    const jsonData = await response.json();
    console.log(jsonData)
    // setTasks(jsonData);
  };

  putWithFetch();
  setTasks(editedTaskList);
}

  return (
    <div className="todoapp stack-large">
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
      {/* <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      > */}
        {taskList}
      {/* </ul> */}
    </div>
  );
}

export default App;
