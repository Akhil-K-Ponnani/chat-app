import React, { useEffect } from 'react'
import { AuthContext } from '../../Contexts/Auth'
import axios from 'axios'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import { AddIcon } from "@chakra-ui/icons"
import Loading from '../Loading/Loading'
import CreateGroup from '../CreateGroup/CreateGroup'

function MyChats({ fetchChats }) {
  const { user, chats, setChats, selectedChat, setSelectedChat } = AuthContext()
  const toast = useToast()

  const showToast = (description, position) => {
    toast({
      title: "Error",
      description: description,
      status: "error",
      duration: 3000,
      isClosable: true,
      position: position
    })
  }

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
    axios.get("/chat", config).then(({ data }) => {
      setChats(data)
    }).catch(() => {
      showToast("Something went Wrong.", "bottom-left")
    })
  }, [fetchChats])

  return (
    <Box d={{ base: selectedChat ? "none" : "flex", md: "flex" }} flexDir="column" bg="white" w={{ base: "100%", md: "31%" }} borderRadius="lg" borderWidth="1px" alignItems="center" p="3">
      <Box d="flex" w="100%" fontSize={{ base: "28px", md: "30px" }} fontFamily="work sans" justifyContent="space-between" alignItems="center" pb="3" px="3">
        My Chats
        <CreateGroup>
          <Button d="flex" fontSize={{ base: "17px", md: "10px", lg: "17px" }} rightIcon={<AddIcon />}>New Group Chat</Button>
        </CreateGroup>
      </Box>
      <Box d="flex" flexDir="column" w="100%" h="100%" bg="#F8F8F8" p="3" borderRadius="lg" overflowY="hidden">
        {chats ? <Stack>
          {
            chats.map((chat) =>
              <Box key={chat._id} bg={(selectedChat && selectedChat._id) === chat._id ? "#38B2AC" : "#E8E8E8"} color={(selectedChat && selectedChat._id) === chat._id ? "white" : "black"} px="3" py="3" borderRadius="lg" cursor="pointer" onClick={() => setSelectedChat(chat)}>
                <Text>{chat.isGroup ? chat.name : (chat.users[0]._id === user._id ? chat.users[1].name : chat.users[0].name)}</Text>
              </Box>
            )
          }
        </Stack> : <Loading />}
      </Box>
    </Box>
  )
}

export default MyChats