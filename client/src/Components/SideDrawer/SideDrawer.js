import React, { useState } from 'react'
import axios from 'axios'
import { useDisclosure } from "@chakra-ui/hooks"
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { AuthContext } from '../../Contexts/Auth'
import Loading from '../Loading/Loading'

function SideDrawer({ children }) {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [chatLoading, setChatLoading] = useState(false)
    const { user, chats, setChats, setSelectedChat } = AuthContext()
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

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

    const handleSearch = () => {
        if (search === "")
            showToast("Please Enter Name or Email", "top-left")
        else {
            setLoading(true)
            let config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            axios.get(`/user?search=${search}`, config).then(({ data }) => {
                setLoading(false)
                setSearchResult(data)
            }).catch(() => {
                showToast("Something went Wrong.", "bottom-left")
                setLoading(false)
            })
        }
    }

    const accessChat = (userId) => {
        setChatLoading(true)
        let config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`
            }
        }
        axios.post("/chat", { userId }, config).then(({ data }) => {
            if (!chats.find((chat) => chat._id === data._id))
                setChats([data, ...chats])
            setSelectedChat(data)
            setChatLoading(false)
            onClose()
        }).catch(() => {
            setChatLoading(false)
            showToast("Something went Wrong", "bottom-left")
        })
    }

    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box d="flex" pb="2">
                            <Input value={search} placeholder="Search by Name or Email" mr="4" onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? <Loading /> : (searchResult && searchResult.map((user) =>
                            <Box key={user._id} d="flex" bg="E8E8E8" color="black" w="100%" px="3" py="2" mb="2" borderRadius="lg" cursor="pointer" _hover={{ background: "#38B2AC", color: "white" }} onClick={() => accessChat(user._id)}>
                                <Avatar name={user.name} src={user.picture} mr="2" size="sm" cursor="pointer" />
                                <Box>
                                    <Text>{user.name}</Text>
                                    <Text fontSize="xs"><b>Email: </b>{user.email}</Text>
                                </Box>
                            </Box>
                        ))}
                        {chatLoading && <Spinner d="flex" ml="auto" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SideDrawer