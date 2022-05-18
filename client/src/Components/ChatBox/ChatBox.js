import React from 'react'
import { AuthContext } from '../../Contexts/Auth'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import Profile from '../Profile/Profile'
import UpdateGroup from '../UpdateGroup/UpdateGroup'

function ChatBox({ fetchChats, setFetchChats }) {
  const { user, selectedChat, setSelectedChat } = AuthContext()
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
                <UpdateGroup fetchChats={fetchChats} setFetchChats={setFetchChats} />
              </>}
          </Text>
          <Box d="flex" flexDir="column" w="100%" h="100%" bg="#E8E8E8" borderRadius="lg" justifyContent="flex-end" p="3" overflow="hidden">
            Messages here...
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