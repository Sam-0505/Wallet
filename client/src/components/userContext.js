import axios from 'axios'
import {createContext, useState, useEffect } from 'react'

export const UserContext = createContext({})

export function UserContextProvider({children}){
    const [user, setUser] = useState(null);

    useEffect(()=>{
        if(!user){
            axios.get("http://localhost:9002/profile",{ withCredentials: true }).then(({data})=>{
                setUser(data);
            });
        }
    },[])

    return(
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}