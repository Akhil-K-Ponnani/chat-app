import React, { useState } from "react"
import { AuthContext } from "../Contexts/Auth"
import Header from "../Components/Header/Header"
import MyChats from "../Components/MyChats/MyChats"
import ChatBox from "../Components/ChatBox/ChatBox"
import { Box } from "@chakra-ui/react"

function Home() {
    const [fetchChats, setFetchChats] = useState(false)
    const { user } = AuthContext()
    return (
        <div style={{ width: "100%" }}>
            {user && <Header />}
            <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <MyChats fetchChats={fetchChats} />}
                {user && <ChatBox fetchChats={fetchChats} setFetchChats={setFetchChats} />}
            </Box>
        </div>
    )
}

export default Home