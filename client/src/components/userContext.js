import axios from 'axios'
import {createContext, useState, useEffect } from 'react'

export const UserContext = createContext({})

export function UserContextProvider({children}){
    const [globUser, setGlobUser] = useState(null);

    console.log(globUser);

    // useEffect(()=>{
    //     if(!user){
    //         axios.get("http://localhost:9002/profile",{ withCredentials: true }).then(({data})=>{
    //             if(data)
    //             setUser(data);
    //         });
    //     }
    // },[])

    return(
        <UserContext.Provider value={{globUser, setGlobUser}}>
            {children}
        </UserContext.Provider>
    )
}