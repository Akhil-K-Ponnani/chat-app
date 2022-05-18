import React, { useState } from 'react'
import { AuthContext } from '../../Contexts/Auth'
import { Avatar, Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { CloseIcon, ViewIcon } from '@chakra-ui/icons'
import axios from 'axios'

function UpdateGroup({ fetchChats, setFetchChats }) {
    const [groupName, setGroupName] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState()
    const [renameLoading, setRenameLoading] = useState(false)
    const { user, selectedChat, setSelectedChat } = AuthContext()
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

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

    const addToGroup = (userData) => {
        if (selectedChat.groupAdmin._id !== user._id)
            showToast("Error", "Only admins can add Someone.", "error")
        else if (selectedChat.users.find((user) => user._id === userData._id))
            showToast("Error", "User already in the group.", "error")
        else {
            setLoading(true)
            let config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            axios.put("/chat/add-to-group", { chatId: selectedChat._id, userId: userData._id }, config).then(({ data }) => {
                setSelectedChat(data)
                setFetchChats(!fetchChats)
                setLoading(false)
            }).catch(() => {
                showToast("Error", "Something went wrong.", "error")
                setLoading(false)
            })
        }
    }

    const deleteFromGroup = (userData) => {
        if (selectedChat.groupAdmin._id !== user._id && userData._id !== user._id)
            showToast("Error", "Only admins can remove Someone.", "error")
        else {
            setLoading(true)
            let config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            axios.put("/chat/remove-from-group", { chatId: selectedChat._id, userId: userData._id }, config).then(({ data }) => {
                userData._id === user._id ? setSelectedChat() : setSelectedChat(data)
                setFetchChats(!fetchChats)
                setLoading(false)
            }).catch(() => {
                showToast("Error", "Something went Wrong.", "error")
                setLoading(false)
            })
        }
    }

    const renameGroup = () => {
        if (groupName === "")
            showToast("Error", "Please fill Group Name.", "error")
        else {
            setRenameLoading(true)
            let config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            axios.put("/chat/rename-group", { chatId: selectedChat._id, groupName }, config).then(({ data }) => {
                setSelectedChat(data)
                setFetchChats(!fetchChats)
                setRenameLoading(false)

            }).catch(({ response }) => {
                showToast("Error", response.data.message, "error")
                setRenameLoading(false)
            })
            setGroupName("")
        }
    }

    const handleSearch = (search) => {
        if (search !== "") {
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
                showToast("Error", "Something went wrong.", "error")
                setLoading(false)
            })
        }
    }

    return (
        <div>
            <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader d="flex" fontSize="35px" fontFamily="work sans" justifyContent="center">{selectedChat.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box d="flex" flexWrap="wrap" w="100%" pb="3">
                            {selectedChat.users.map((user) =>
                                <Box variant="solid" fontSize="12" bg="purple" color="white" borderRadius="lg" m="1" mb="2" px="2" py="1" cursor="pointer" onClick={() => deleteFromGroup(user)}>
                                    {user.name}
                                    <CloseIcon pl="1" />
                                </Box>
                            )}
                        </Box>
                        <FormControl d="flex">
                            <Input placeholder="Group Name" mb="3" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                            <Button variant="solid" colorScheme="teal" ml="1" isLoading={renameLoading} onClick={renameGroup}>Update</Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add User" mb="1" onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {loading ? <Spinner size="lg" /> : searchResult.slice(0, 4).map((user) =>
                            <Box key={user._id} d="flex" bg="E8E8E8" color="black" w="100%" px="3" py="2" mb="2" borderRadius="lg" cursor="pointer" _hover={{ background: "#38B2AC", color: "white" }} onClick={() => addToGroup(user)}>
                                <Avatar name={user.name} src={user.picture} mr="2" size="sm" cursor="pointer" />
                                <Box>
                                    <Text>{user.name}</Text>
                                    <Text fontSize="xs"><b>Email: </b>{user.email}</Text>
                                </Box>
                            </Box>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => deleteFromGroup(user)}>Leave Group</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default UpdateGroup