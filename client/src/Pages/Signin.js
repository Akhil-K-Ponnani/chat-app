import React, { useEffect } from "react"
import Login from "../Components/Login/Login"
import Signup from "../Components/Signup/Signup"
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

function Signin() {
    const navigate = useNavigate()
    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        if(user)
            navigate("/")
    })
    return (
        <Container maxW="xl">
            <Box d="flex" justifyContent="center" p="3" bg="white" width="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px">
                <Text fontSize="4xl" fontFamily="work sans">Chat App</Text>
            </Box>
            <Box bg="white" w="100%" p="4" borderRadius="lg" borderWidth="1px">
                <Tabs variant="soft-rounded">
                    <TabList mb="1em">
                        <Tab w="50%">Login</Tab>
                        <Tab w="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Signin