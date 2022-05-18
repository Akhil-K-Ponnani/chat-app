import React, { useEffect, useState } from 'react'
import axios from "axios"
import io from "socket.io-client"
import Lottie from "react-lottie"
import Profile from '../Profile/Profile'
import UpdateGroup from '../UpdateGroup/UpdateGroup'
import { AuthContext } from '../../Contexts/Auth'
import typingAnimation from "../../Assets/Animations/typing.json"
import { Box, IconButton, Text, Spinner, FormControl, Input, useToast, Avatar, Tooltip } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import ScrollableFeed from "react-scrollable-feed"
import "../../styles.css"

let socket, selectedChatBackup

function ChatBox({ fetchChats, setFetchChats }) {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const { user, selectedChat, setSelectedChat, notifications, setNotifications } = AuthContext()
  const toast = useToast()

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3000,
      isClosable: true,
      position: "bottom"
    })
  }

  const isSameSender = (index) => {
    return (index < messages.length - 1) && (messages[index + 1].sender._id !== messages[index].sender._id || messages[index + 1].sender._id === undefined) && (messages[index].sender._id !== user._id)

  }

  const isLastMessage = (index) => {
    return (index === messages.length - 1) && (messages[messages.length - 1].sender._id !== user._id) && (messages[messages.length - 1].sender._id)
  }

  const isSameSenderMargin = (index) => {
    if (index < messages.length - 1 && messages[index + 1].sender._id === messages[index].sender._id && messages[index].sender._id !== user._id)
      return 33
    else if ((index < messages.length - 1 && messages[index + 1].sender._id !== messages[index].sender._id && messages[index].sender._id !== user._id) || (index === messages.length - 1 && messages[index].sender._id !== user._id))
      return 0
    else
      return "auto"
  }

  const isSameUser = (index) => {
    return index > 0 && messages[index - 1].sender._id === messages[index].sender._id
  }

  const handleTyping = (e) => {
    setMessage(e.target.value)
    if (socketConnected) {
      socket.emit("typing", selectedChat._id)
      setTimeout(() => {
        socket.emit("stop-typing", selectedChat._id)
      }, 3000)
    }
  }

  const sendMessage = (e) => {
    if (e.key === "Enter" && message !== "") {
      socket.emit("stop-typing", selectedChat._id)
      let config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      }
      setMessage("")
      axios.post("/message", { content: message, chatId: selectedChat._id }, config).then(({ data }) => {
        socket.emit("send-message", data)
        setMessages([...messages, data])
      }).catch(() =>
        showToast("Error", "Something went Wrong", "error")
      )
    }
  }

  const fetchMessages = () => {
    setLoading(true)
    if (selectedChat) {
      let config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      axios.get(`/message/${selectedChat._id}`, config).then(({ data }) => {
        setMessages(data)
        socket.emit("join-chat", selectedChat._id)
        setLoading(false)
      }).catch(() => {
        showToast("Error", "Something went Wrong.", "error")
        setLoading(false)
      })
    }
  }

  useEffect(() => {
    socket = io()
    socket.emit("setup", user._id)
    socket.on("connected", () => setSocketConnected(true))
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop-typing", () => setIsTyping(false))
  }, [])

  useEffect(() => {
    fetchMessages()
    selectedChatBackup = selectedChat
  }, [selectedChat])


  useEffect(() => {
    socket.on("recieve-message", (message) => {
      if (selectedChatBackup && selectedChatBackup._id === message.chat._id)
        setMessages([...messages, message])
      else {
        if (!notifications.includes(message)) {
          setNotifications([message, ...notifications])
          setFetchChats(!fetchChats)
        }
      }
    })
  })

  return (
    <Box d={{ base: selectedChat ? "flex" : "none", md: "flex" }} flexDir="column" w={{ base: "100%", md: "68%" }} bg="white" alignItems="center" borderRadius="lg" borderWidth="1px" p="3">
      {
        selectedChat ? <>
          <Text d="flex" w="100%" fontSize={{ base: "28px", md: "30px" }} fontFamily="work sans" justifyContent={{ base: "space-between" }} alignItems="center" pb="3" px="2">
            <IconButton d={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat()} />
            {!selectedChat.isGroup ? <>
              {selectedChat.users[0]._id === user._id ? selectedChat.users[1].name : selectedChat.users[0].name}
              <Profile user={selectedChat.users[0]._id === user._id ? selectedChat.users[1] : selectedChat.users[0]} />
            </> :
              <>
                {selectedChat.name.toUpperCase()}
                <UpdateGroup fetchChats={fetchChats} setFetchChats={setFetchChats} fetchMessages={fetchMessages} />
              </>}
          </Text>
          <Box d="flex" flexDir="column" w="100%" h="100%" bg="#E8E8E8" borderRadius="lg" justifyContent="flex-end" p="3" overflow="hidden">
            {loading ? <Spinner w="20" h="20" size="xl" alignSelf="center" margin="auto" />
              : <div className="messages">
                <ScrollableFeed>
                  {messages && messages.map((message, index) =>
                    <div key={message._id} style={{ display: "flex" }}>
                      {(isSameSender(index) || isLastMessage(index))
                        && <Tooltip label={message.sender.name} placement="bottom-start" hasArrow>
                          <Avatar src={message.sender.picture} name={message.sender.name} size="sm" mt="7px" mr="1" cursor="pointer" />
                        </Tooltip>}
                      <span style={{ backgroundColor: message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0", maxWidth: "75%", borderRadius: "20px", padding: "5px 15px", marginLeft: isSameSenderMargin(index), marginTop: isSameUser(index) ? 3 : 10 }}>{message.content}</span>
                    </div>
                  )}
                </ScrollableFeed>
              </div>}
            <FormControl mt="3" onKeyDown={sendMessage} isRequired>
              {isTyping && <div><Lottie options={{ animationData: typingAnimation, autoplay: true, loop: true, rendererSettings: { preserveAspectRatio: "xMidYMid slice" } }} width="70px" style={{ marginBottom: 15, marginLeft: 0 }} /></div>}
              <Input variant="filled" bg="#E0E0E0" value={message} placeholder="Enter a Message..." onChange={handleTyping} />
            </FormControl>
          </Box>
        </> :
          <Box d="flex" h="100%" alignItems="center" justifyContent="center">
            <Text fontSize="3xl" fontFamily="work sans" pb="3">Click on a user to start Chatting...</Text>
          </Box>
      }
    </Box>
  )
}

export default ChatBox