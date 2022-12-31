import {useState, useEffect} from 'react';

function UserDetails() {
    const [username,setUsername]= useState("")
    const [age,setAge]= useState(0)

    useEffect(() => {
        const username = localStorage.getItem("username");
        const age = localStorage.getItem("age");
          setAge(age);
          setUsername(username);
        },[])
        console.log(age);

    function deleteToken(){
        localStorage.clear();
        window.location.href = '/create-user'
    }

    return (
      <div>
      <h1>User</h1>
      <h5>username : {username}</h5>
      <h5>age : {age}</h5>
      <button onClick={deleteToken}>Delete Token</button>
      </div>
    );
  }
  
  export default UserDetails;