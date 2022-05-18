import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from "@chakra-ui/react"

function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cpassword, setCpassword] = useState("")
    const [picture, setPicture] = useState()
    const [show, setShow] = useState(false)
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

    const userSignup = (userData) => {
        let config = { headers: { "Content-type": "application/json" } }
        axios.post("/user/signup", userData, config).then(({ data }) => {
            localStorage.setItem("user", JSON.stringify(data))
            showToast("Success", "Signup Successful", "success")
            setLoading(false)
            navigate("/")
        }).catch(({response}) => {
            showToast("Error", response.data.message, "error")
            setLoading(false)
        })
    }

    const handleSubmit = () => {
        if (name !== "") {
            if (email !== "" && email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                if (password.length >= 8 && password.length <= 15) {
                    if (cpassword !== "") {
                        if (password === cpassword) {
                            setLoading(true)
                            if (picture === undefined)
                                userSignup({ name, email, password })
                            else {
                                let data = new FormData()
                                data.append("file", picture)
                                data.append("upload_preset", "chat-app")
                                data.append("cloud_name", "akhil-cloudinary")
                                axios.post("https://api.cloudinary.com/v1_1/akhil-cloudinary/image/upload", data).then(({ data }) => {
                                    userSignup({ name, email, password, picture: data.url })
                                }).catch(() => {
                                    showToast("Error", "Failed to upload Image", "error")
                                    setLoading(false)
                                })
                            }
                        }
                        else
                            showToast("Error", "Password doesn't Match.", "error")
                    }
                    else
                        showToast("Error", "Please confirm your Password.", "error")
                }
                else
                    showToast("Error", "Password must be 8-15 Characters.", "error")
            }
            else
                showToast("Error", "Please Enter a valid Email.", "error")
        }
        else
            showToast("Error", "Please Enter your Name.", "error")
    }

    return (
        <VStack spacing="5px">
            <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input type="text" placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder="Enter Your Password" onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement w="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="cpassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder="Confirm Your Password" onChange={(e) => setCpassword(e.target.value)} />
                    <InputRightElement w="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="picture">
                <FormLabel>Upload your Picture</FormLabel>
                <Input type="file" p="1.5" accept="image/*" onChange={(e) => setPicture(e.target.files[0])} />
            </FormControl>
            <Button colorScheme="blue" w="100%" style={{ marginTop: "15px" }} isLoading={loading} onClick={handleSubmit}>Sign Up</Button>
        </VStack>
    )
}

export default Signup