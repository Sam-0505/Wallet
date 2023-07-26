import axios from 'axios'
import {createContext, useState, useEffect } from 'react'

export const UserContext = createContext({})

export function UserContextProvider({children}){
    const [globUser, setGlobUser] = useState(null);

    //console.log(globUser);

    return(
        <UserContext.Provider value={{globUser, setGlobUser}}>
            {children}
        </UserContext.Provider>
    )
}