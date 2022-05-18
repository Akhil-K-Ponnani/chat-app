import React from 'react'
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../Contexts/Auth"
import Profile from '../Profile/Profile'
import SideDrawer from '../SideDrawer/SideDrawer'
import { Box } from "@chakra-ui/layout"
import { Button, Tooltip, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import NotificationBadge, { Effect } from "react-notification-badge"

function Header() {
    const { user, setSelectedChat, notifications, setNotifications } = AuthContext()
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("user")
        navigate("/signin")
    }

    return (
        <div>
            <Box d="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
                <Tooltip label="Seach Users to Chat" hasArrow placement="bottom-end">
                    <SideDrawer user={user} >
                        <Button variant="ghost">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <Text d={{ base: "none", md: "flex" }} px="4">Seach User</Text>
                        </Button>
                    </SideDrawer>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="work sans">Chat-App</Text>
                <div>
                    <Menu>
                        <MenuButton p="1">
                            <NotificationBadge count={notifications.length} effect={Effect.SCALE} />
                            <BellIcon fontSize="2xl" m="1" />
                        </MenuButton>
                        <MenuList pl="2">
                            {!notifications.length && "No New Message"}
                            {notifications.map((notification) =>
                                <MenuItem key={notification._id} onClick={() => {
                                    setSelectedChat(notification.chat)
                                    setNotifications(notifications.filter((notificationData) => notificationData !== notification))
                                }}>
                                    {notification.chat.isGroup ? `New Message from ${notification.chat.name}` : `New Message from ${notification.chat.users[0]._id === user._id ? notification.chat.users[1].name : notification.chat.users[0].name}`}
                                </MenuItem>
                            )}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.picture} />
                        </MenuButton>
                        <MenuList>
                            <Profile user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </Profile>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
        </div>
    )
}

export default Header