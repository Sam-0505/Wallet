import { useContext } from "react";
import { UserContext } from "../userContext";

export default function Dashboard(){
    const user = useContext(UserContext)

    console.log(user);

    return (<div>
        <h1>Dashboard</h1>
        {!! user && (<h2>Hi {user.name} !!</h2>)}
    </div>)
}