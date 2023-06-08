import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import GoogleLoginButton from "../../component/google_login_button";
import { useAuth } from "../../context/auth_user.context";
import { ServiceLayout } from "../../component/service_layout";

export default function Home() {
  const {signInWithGoogle, authUser} = useAuth();
  console.log(authUser);
  return (
    <>
      <ServiceLayout title="test" minH="100vh" backgroundColor="gray.50">
        <Box maxW="md" mx="auto" pt="10">
          <img src="./main_logo.svg" alt="main logo" />
          <Flex justify="center">
            <Heading>#BlahBlah</Heading>
          </Flex>
        </Box>
        <Center mt="20">
          <GoogleLoginButton onClick={signInWithGoogle} />
        </Center>
      </ServiceLayout>
    </>
  )
};