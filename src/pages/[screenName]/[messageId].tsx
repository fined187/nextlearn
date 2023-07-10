import { GetServerSideProps, NextPage } from "next";
import { ServiceLayout } from "../../../component/service_layout";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../../../context/auth_user.context";
import { InAuthUser } from "../../../model/in_auth_user";
import axios, { AxiosResponse } from "axios";
import MessageItem from "../../../component/message_item";
import { InMessage } from "../../../model/message/in_message";
import Link from "next/link";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import Head from "next/head";

interface Props {
  userInfo: InAuthUser | null;
  messageData: InMessage | null;
  screenName: string;
  baseUrl: string;
}

const MessagePage: NextPage<Props> = function ({ userInfo, messageData: initMsgData, screenName, baseUrl }) {
  const [messageData, setMessageData] = useState<null | InMessage>(initMsgData);
  const { authUser } = useAuth();

  async function fetchMessageInfo({
    uid,
    messageId,
  }: {
    uid: string;
    messageId: string;
  }) {
    try {
      const resp = await fetch(
        `/api/message.info?uid=${uid}&messageId=${messageId}`
      );
      if (resp.status === 200) {
        const data: InMessage = await resp.json();
        setMessageData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if(userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>
  }
  if(messageData === null) {
    return <p>메세지 정보가 없습니다.</p>
  }
  const isOwner = authUser !== null && authUser.uid === userInfo.uid;
  const metaImgUrl = `${baseUrl}/open-graph=img?text=${encodeURIComponent(messageData.message)}`;
  const thumbnailImgUrl = `${baseUrl}/api/thumbnail?url=${encodeURIComponent(metaImgUrl)}`;

  return (
    <>
      <Head>
        <meta property="og:image" content={thumbnailImgUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@blax2" />
        <meta name="twitter:title" content={messageData.message} />
        <meta name="twitter:image" content={thumbnailImgUrl} />
      </Head>
      <ServiceLayout
        title={userInfo?.displayName!}
        backgroundColor="gray.50"
        minH="100vh"
      >
        <Box maxW="md" mx="auto" pt="6">
          <Link href={`/${screenName}`}>
            <Button leftIcon={<ChevronLeftIcon />} mb="2" fontSize="sm">
              {screenName}홈으로
            </Button>
          </Link>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            mb="2"
            bg="white"
          >
            <Flex padding="6">
              <Avatar
                size="lg"
                src={userInfo?.photoURL ?? "https://bit.ly/broken-link"}
                mr="2"
              />
              <Flex direction="column" justify="center">
                <Text fontSize="md">{userInfo?.displayName}</Text>
                <Text fontSize="xs">{userInfo?.email}</Text>
              </Flex>
            </Flex>
          </Box>
          <MessageItem
            item={messageData!}
            uid={userInfo.uid}
            screenName={screenName}
            displayName={userInfo.displayName ?? ""}
            photoURL={userInfo.photoURL ?? "https://bit.ly/broken-link"}
            isOwner={isOwner}
            onSendComplete={() => {
              fetchMessageInfo({
                uid: userInfo.uid,
                messageId: messageData!.id,
              });
            }}
          />
        </Box>
      </ServiceLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const { screenName, messageId } = query;
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
        messageData: null,
        screenName: '',
        baseUrl: ''
      },
    };
  }
  if (messageId === undefined) {
    return {
      props: {
        userInfo: null,
        messageData: null,
        screenName: '',
        baseUrl: ''
      },
    };
  }
  try {
    const protocol = process.env.PROTOCOL || "http";
    const host = process.env.HOST || "localhost";
    const port = process.env.PORT || "3000";
    const baseUrl = `${protocol}://${host}:${port}`;
    const userInfoResp: AxiosResponse<InAuthUser> = await axios(
      `${baseUrl}/api/user.info/${screenName}`
    );
    const screenNameToStr = Array.isArray(screenName) ? screenName[0] : screenName;
    if(userInfoResp.status !== 200 || userInfoResp.data === undefined || userInfoResp.data.uid === undefined) {
      return {
        props: {
          userInfo: null,
          messageData: null,
          screenName: screenNameToStr,
          baseUrl,
        },
      };
    }

    const messageInfoResp: AxiosResponse<InMessage> = await axios(
      `${baseUrl}/api/messages.info?uid=${userInfoResp.data.uid}&messageId=${messageId}`
    );

    return {
      props: {
        userInfo: userInfoResp.data,
        messageData: messageInfoResp.status !== 200 || messageInfoResp.data === undefined ? null : messageInfoResp.data,
        screenName: screenNameToStr,
        baseUrl,
      },
    };

  } catch (error) {
    console.log(error);
    return {
      props: {
        userInfo: null,
        messageData: null,
        screenName: '',
        baseUrl: '',
      },
    };
  }
};

export default MessagePage;