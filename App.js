import React, { useState, useEffect } from 'react';

function App() {
  const [boardData, setBoardData] = useState(() => {
    const savedData = localStorage.getItem('trelloBoard');
    return savedData ? JSON.parse(savedData) : [
      { id: 0, title: 'To Do', tasks: [{ text: 'Project setup', isEditing: false, priority: 'Medium' }] },
      { id: 1, title: 'In Progress', tasks: [{ text: 'Trello UI banana', isEditing: false, priority: 'High' }] },
      { id: 2, title: 'Done', tasks: [{ text: 'Environment set', isEditing: false, priority: 'Low' }] }
    ];
  });

  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('trelloBoard', JSON.stringify(boardData));
  }, [boardData]);

  const addTask = () => {
    if (newTask.trim() === '') return;
    const updatedData = [...boardData];
    updatedData[0].tasks.push({ text: newTask, isEditing: false, priority: newPriority });
    setBoardData(updatedData);
    setNewTask('');
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return '#ffcccc';
    if (priority === 'Medium') return '#fff3cc';
    return '#ccffcc';
  };

  const toggleEdit = (listIndex, taskIndex) => {
    const updatedData = [...boardData];
    updatedData[listIndex].tasks[taskIndex].isEditing = !updatedData[listIndex].tasks[taskIndex].isEditing;
    setBoardData(updatedData);
  };

  const editTask = (listIndex, taskIndex, newText) => {
    const updatedData = [...boardData];
    updatedData[listIndex].tasks[taskIndex].text = newText;
    setBoardData(updatedData);
  };

  const deleteTask = (listIndex, taskIndex) => {
    const updatedData = [...boardData];
    updatedData[listIndex].tasks.splice(taskIndex, 1);
    setBoardData(updatedData);
  };

  const moveTask = (fromList, taskIndex, toList) => {
    const task = boardData[fromList].tasks[taskIndex];
    const updatedData = [...boardData];
    updatedData[fromList].tasks.splice(taskIndex, 1);
    updatedData[toList].tasks.push(task);
    setBoardData(updatedData);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Mera Trello Board</h1>
      <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
      <br/><br/>
      
      <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Naya task..." />
      <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button onClick={addTask}>Add Task</button>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {boardData.map((list, listIndex) => (
          <div key={list.id} style={{ backgroundColor: '#ebecf0', width: '250px', padding: '15px', borderRadius: '8px' }}>
            <h3>{list.title}</h3>
            {list.tasks
              .filter(task => task.text.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((task, taskIndex) => (
              <div key={taskIndex} style={{ backgroundColor: getPriorityColor(task.priority), padding: '10px', margin: '10px 0', borderRadius: '4px', borderLeft: '5px solid #aaa' }}>
                {task.isEditing ? (
                  <input value={task.text} onChange={(e) => editTask(listIndex, taskIndex, e.target.value)} onBlur={() => toggleEdit(listIndex, taskIndex)} />
                ) : (
                  <span onClick={() => toggleEdit(listIndex, taskIndex)}>
                    <strong>[{task.priority}]</strong> {task.text}
                  </span>
                )}
                <div style={{ marginTop: '10px' }}>
                  {listIndex > 0 && <button onClick={() => moveTask(listIndex, taskIndex, listIndex - 1)}>←</button>}
                  <button onClick={() => deleteTask(listIndex, taskIndex)} style={{ margin: '0 5px' }}>x</button>
                  {listIndex < 2 && <button onClick={() => moveTask(listIndex, taskIndex, listIndex + 1)}>→</button>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;