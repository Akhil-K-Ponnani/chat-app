import React, { useState } from 'react'
import { AuthContext } from '../../Contexts/Auth'
import { Avatar, Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { CloseIcon } from '@chakra-ui/icons'

function CreateGroup({ children }) {
    const [groupName, setGroupName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const { user, chats, setChats } = AuthContext()
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

    const handleSearch = (search) => {
        if (search !== "") {
            setLoading(true)
            let config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            axios.get(`/user?search=${search}`, config).then(({ data }) => {
                console.log(data);
                setLoading(false)
                setSearchResult(data)
            }).catch(() =>
                showToast("Error", "Something went Wrong.", "error")
            )
        }
    }

    const handleCreate = () => {
        if (groupName === "" || selectedUsers.length === 0)
            showToast("Error", "Please fill all the Fields.", "error")
        else {
            let config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            axios.post("/chat/create-group", { name: groupName, users: selectedUsers }, config).then(({ data }) => {
                console.log(data);
                setChats([data, ...chats])
                onClose()
                showToast("Success", `${groupName} Created.`, "success")
            }).catch(({ response }) =>
                showToast("Error", response.data.message, "error")
            )
        }
    }

    const addToGroup = (user) => {
        if (selectedUsers.includes(user))
            showToast("Error", "User already Added.", "error")
        else
            setSelectedUsers([...selectedUsers, user])
    }

    const deleteFromGroup = (user) => {
        setSelectedUsers(selectedUsers.filter((selUser) => selUser._id !== user._id))
    }

    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader d="flex" fontSize="35px" fontFamily="work sans" justifyContent="center">Create Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input placeholder="Group Name" mb="3" onChange={(e) => setGroupName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add Users" mb="1" onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box d="flex" w="100%">
                            {selectedUsers.map((user) =>
                                <Box variant="solid" fontSize="12" bg="purple" color="white" borderRadius="lg" m="1" mb="2" px="2" py="1" cursor="pointer" onClick={() => deleteFromGroup(user)}>
                                    {user.name}
                                    <CloseIcon pl="1" />
                                </Box>
                            )}
                        </Box>
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
                        <Button colorScheme='blue' onClick={handleCreate}>Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default CreateGroup