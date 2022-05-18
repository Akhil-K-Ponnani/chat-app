import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

function Login() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [show, setShow] = useState()

    const handleSubmit = () => {

    }

    return (
        <VStack spacing='5px'>
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
            <Button colorScheme='blue' w='100%' style={{ marginTop: '15px' }} onClick={handleSubmit}>Login</Button>
            <Button colorScheme='red' width='100%' onClick={()=>{
                setEmail('guest@example.com')
                setPassword('12345678')}}>Get Guest User Credentials</Button>
        </VStack>
    )
}

export default Login