import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../../Components/Sidebar";
import ChatScreen from "../../Components/ChatScreen";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useCollection } from "react-firebase-hooks/firestore";

function Chat({ chat, messages }) {
    const [user] = useAuthState(auth);
    const [recipientSnapshot] = useCollection(
    db
        .collection("users")
        .where("email", "==", getRecipientEmail(chat.users, user))
    );

    const recipient = recipientSnapshot?.docs?.[0]?.data();


  return (
    <Container>
      <Head>
        <title>
          Chat with{" "}
          {recipient ? recipient?.name : getRecipientEmail(chat.users, user)}
        </title>
        <link
          rel="icon"
          href="https://pngimg.com/uploads/whatsapp/whatsapp_PNG95158.png"
        />
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen
          chat={chat}
          messages={messages}
          recipient={recipient}
          recipientSnapshot={recipientSnapshot}
        />
      </ChatContainer>
    </Container>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

    //Prepping the messages on the server
    const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

    const messages = messagesRes.docs
    ?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
    .map((messages) => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime(),
    }));

    //Prepping The Chats
    const chatRes = await ref.get();
    const chat = {
    id: chatRes.id,
    ...chatRes.data(),
    };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat,
    },
  };
}


const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
