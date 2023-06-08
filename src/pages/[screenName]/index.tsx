import { NextPage } from "next";
import {ServiceLayout} from "../../../component/service_layout";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

const userInfo = {
  uid: 'test',
  email: 'fined000@naver.com',
  displayName: 'wootaiklee',
  photoURL: ''
}

const UserHomePage: NextPage = function() {
  return (
    <ServiceLayout title="user home" minH="100vh" backgroundColor="gray.50">
      <Box maxW="md" mx="auto" pt="6" >
        <Box border="1px" borderRadius="lg" overflow="hidden" mb="2"
          bg="white"
        >
          <Flex p="6">
            <Avatar size="lg" src={userInfo.photoURL} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">
                {userInfo.displayName}
              </Text>
              <Text fontSize="xs">
                {userInfo.email}
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </ServiceLayout>
  )
};

export default UserHomePage;