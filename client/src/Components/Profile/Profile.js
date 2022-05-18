import React from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'

function Profile({ user, children }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    return (
        <div>
            {
                children ? (
                    <span onClick={onOpen}>{children}</span>
                ) : (
                    <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
                )
            }
            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader d="flex" fontSize="40px" fontFamily="work sans" justifyContent="center">{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d="flex" flexDir="column" alignItems="center" justifyContent="space-between">
                        <Image src={user.picture} boxSize="150px" borderRadius="full" alt={user.name} />
                        <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="work sans">Email: {user.email}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Profile