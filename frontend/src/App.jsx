import { useEffect, useState } from 'react'
import axios from 'axios'
import {MdModeEditOutline, MdOutlineDone} from 'react-icons/md'
import {FaTrash} from 'react-icons/fa'
import {IoClose} from 'react-icons/io5' 


function App() {

  const [newTodo,setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo,setEditingTodo] = useState(null);
  const [editedtext,setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("/api/todos",{text: newTodo})
      setTodos([...todos, response.data])
      setNewTodo('');
    } catch (error) {
      console.log("error adding todo:", error)
    }
  }

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      console.log(response.data)
      setTodos(response.data)
    } catch (error) {
      console.log("error fetching todos",error)
    }
  }

  useEffect(() => {
    fetchTodos();
  },[])

  const startEditing = (todo) =>{
    setEditingTodo(todo._id)
    setEditedText(todo.text)
  }

  const saveEdit = async (id)=> {
    try {
      const response = await axios.patch(`/api/todos/${id}`,{
        text: editedtext
      })
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)))
      setEditingTodo(null)
      setEditedText("")
    } catch (error) {
      
      console.log("error updating todo:",error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`)
      setTodos(todos.filter((todo) => todo._id !== id))
    } catch (error) {
      console.log("error deleting todo:",error)
    }
  }

  const toggleComplete = async (id, currentStatus) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !currentStatus
      })
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)))
    } catch (error) {
      console.log("error toggling todo:", error)
    }
  }

  return (
  <div className='min-h-screen bg-gradient-to-br
              from-gray-50 to-gray-800
             flex items-center justify-center p-4' >
      <div className='bg-white rounded-2xl shadow-xl 
                  w-full max-w-lg p-8'>
            
            <h1 className='text-4xl font-bold
                text-gray-800 mb-8 text-center'>Task manager
            </h1>
            
            <form 
            onSubmit={addTodo}
            className='flex items-center gap-2 shadow-sm border border-gray-200 
            p-2 rounded-lg'>
                <input className='flex-1 outline-none
                px-3 py-2 text-gray-700 placeholder-gray-400'
                type="text" 
                value= {newTodo} 
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder='What needs to be done?'
                required/>
                <button 
                type='submit'
                className='bg-blue-500
                hover:bg-blue-600
                text-white px-4 py-2 rounded-md font-medium cursor-pointer'>Add Task</button>
            </form>
            <div className='mt-4'>
              {todos.length === 0 ? (
                <div></div>
              ):(
                <div className='flex flex-col gap-4'>
                  {todos.map((todo)=> (
                    <div key={todo._id} >
                      {editingTodo === todo._id ?(
                         <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                          <div className='flex items-start gap-x-3'>
                            <textarea
                            className='flex-1 p-3 border border-gray-200 rounded-lg
                            outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner
                            resize-none min-h-[2.5rem] max-h-32 overflow-y-auto'
                            value= {editedtext}
                            onChange={(e) => setEditedText(e.target.value)}
                            rows="1"
                            onInput={(e) => {
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}/>
                            <div className='flex gap-x-2 flex-shrink-0'>
                              <button
                              onClick={()=> saveEdit(todo._id)}
                              className='px-4 py-2
                               bg-green-500
                              text-white rounded-lg
                              hover:bg-green-600 cursor-pointer'>
                                <MdOutlineDone/>
                              </button>
                              <button
                              className='px-4 py-2 bg-gray-200
                              text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer'
                              onClick={()=> {
                                setEditingTodo(null)
                                setEditedText("")
                              }}><IoClose/></button>
                            </div>
                          </div>
                         </div>
                      ):(
                        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                          <div className='flex items-center justify-between gap-x-3'>
                            <div className='flex items-center gap-x-3 flex-1 min-w-0'>
                              <button
                                className={`h-6 w-6 border rounded-full flex items-center justify-center flex-shrink-0
                                ${todo.completed ? "bg-green-500 border-green-500 " :
                                 "border-gray-300 hover:border-blue-400"}`}
                                onClick={() => toggleComplete(todo._id, todo.completed)}>
                              {todo.completed && <MdOutlineDone/>}
                            </button>
                          <span
                            className={`font-medium truncate ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                            title={todo.text}>
                            {todo.text}
                            </span>
                            </div>
                          <div className='flex gap-x-2 flex-shrink-0'>
                            <button
                            className='p-2 text-blue-500 hover:text-blue-700
                            rounded-lg hover:bg-blue-50 duration-200'
                            onClick={()=>startEditing(todo)}>
                            <MdModeEditOutline/>
                            </button>
                          <button
                            className='p-2 text-red-500 hover:text-red-700
                            rounded-lg hover:bg-red-50 duration-200'
                            onClick={()=> deleteTodo(todo._id)}><FaTrash/></button>
                          </div>
                        </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              )}
            </div>
      </div>
  </div>
  )
}

export default App
