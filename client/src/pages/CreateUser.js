import {useState} from 'react';

function CreateUser() {
    const [username,setUsername]= useState('')
    const [password,setPassword]= useState('')
    const [age,setAge]= useState(0)

    async function createUser(event){
        event.preventDefault()
        const response = await fetch('http://localhost:5000/user',{
          method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    age
                }),
        })
        const data = await response.json()
		if (data.success==true) {
			localStorage.setItem('token', data.access_token)
			// alert('Login successful')
			window.location.href = '/user-details'
		} else {
		    alert(data.message)
		}
      }

    return (
        <div>
        <h1>Create User</h1>
        <form onSubmit={createUser}>
          <input 
          type="text" 
          placeholder="username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          />
          <br/><br/>
          <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />
          <br/><br/>
          <input 
          type="number" 
          value={age}
          onChange={(e)=>setAge(e.target.value)}
          />
          <br/><br/>
          <input type="submit" value="Submit"/>
        </form>
        </div>
    );
  }
  
  export default CreateUser;