import { Box } from "@chakra-ui/react"
import React from "react"
import ChatBox from "../Components/ChatBox/ChatBox"
import Header from "../Components/Header/Header"
import MyChats from "../Components/MyChats/MyChats"
import { AuthContext } from "../Contexts/Auth"

function Home() {
    const { user } = AuthContext()
    return (
        <div style={{ width: "100%" }}>
            {user && <Header />}
            <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div>
    )
}

export default Home