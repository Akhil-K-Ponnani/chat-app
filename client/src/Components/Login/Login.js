import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from "@chakra-ui/react"

function Login() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [show, setShow] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()

    const showToast = (title, description, status) => {
        toast({
            title: title,
            description: description,
            status: status,
            duration: 3000,
            isClosable: true
        })
    }

    const handleSubmit = () => {
        if (email !== "" && email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            if (password !== "") {
                setLoading(true)
                let config = { headers: { "Content-type": "application/json" } }
                axios.post("/user/login", { email, password }, config).then(({ data }) => {
                    localStorage.setItem("user", JSON.stringify(data))
                    showToast("Success", "Login Successful", "success")
                    setLoading(false)
                    navigate("/")
                }).catch(({ response }) => {
                    showToast("Error", response.data.message, "error")
                    setLoading(false)
                })
            }
            else
                showToast("Error", "Please Enter your Password.", "error")
        }
        else
            showToast("Error", "Please Enter a valid Email.", "error")
    }

    return (
        <VStack spacing="5px">
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="text" value={email} placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} value={password} placeholder="Enter Your Password" onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement w="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button colorScheme="blue" w="100%" style={{ marginTop: "15px" }} isLoading={loading} onClick={handleSubmit}>Login</Button>
            <Button colorScheme="red" width="100%" onClick={() => {
                setEmail("guest@example.com")
                setPassword("12345678")
            }}>Get Guest User Credentials</Button>
        </VStack>
    )
}

export default Login