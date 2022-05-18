import React, { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Auth = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        let userInfo = JSON.parse(localStorage.getItem("user"))
        setUser(userInfo)
        if (!userInfo)
            navigate("/signin")
    }, [navigate])
    return (
        <Auth.Provider value={{ user, chats, setChats, selectedChat, setSelectedChat }}>{children}</Auth.Provider>
    )
}

export const AuthContext = () => {
    return useContext(Auth)
};

export default AuthProvider;