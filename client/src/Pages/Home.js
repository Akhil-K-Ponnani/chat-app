import React, { useEffect, useState } from "react"
import axios from "axios"

function Home() {
    const [chats, setChats] = useState([])
    const fetchData = async () => {
        let {data} = await axios.get("/chats")
        setChats(data);
    }
    useEffect(() => {
        fetchData()
    })
    return (
        <div>
            {
                chats.map((chat, id)=>
                <h1 key={id}>{chat.chatName}</h1>
                )
            }
        </div>
    )
}

export default Home