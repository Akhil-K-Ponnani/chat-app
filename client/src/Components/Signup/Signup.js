import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

function Signup() {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [cpassword, setCpassword] = useState()
    const [picture, setPicture] = useState()
    const [show, setShow] = useState(false)
    
    const handleSubmit = () => {

    }

    return (
        <VStack spacing='5px'>
            <FormControl id='name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input type='text' placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='text' placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement w='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='cpassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} placeholder='Confirm Your Password' onChange={(e) => setCpassword(e.target.value)} />
                    <InputRightElement w='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='picture'>
                <FormLabel>Upload your Picture</FormLabel>
                <Input type='file' p='1.5' accept='image/*' onChange={(e) => setPicture(e.target.files[0])} />
            </FormControl>
            <Button colorScheme='blue' w='100%' style={{ marginTop: '15px' }} onClick={handleSubmit}>Sign Up</Button>
        </VStack>
    )
}

export default Signup