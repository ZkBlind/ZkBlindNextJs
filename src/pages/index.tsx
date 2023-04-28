import {
  Image,
  Text,
  Button,
  Paper,
  Grid,
  Center,
  Modal,
  Group,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState, useEffect } from "react";
import { useAccount, useSigner, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { createStyles } from "@mantine/core";
import Link from "next/link";

import { getContractInfo } from "@/utils/contracts";

const useStyles = createStyles((theme) => ({
  details: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.blue[1],

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
      lineHeight: 0.1,
    },
  },
  post: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.lg,
    fontWeight: 500,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.blue[0],

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },
  error: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.lg,
    fontWeight: 600,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.blue[0],

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },
}));

const demoMessages = [
  {
    id: 1,
    message:
      "Discover the power of anonymity with ZkBlind! Our innovative zero-knowledge technology ensures your identity is secure while sharing sensitive information with confidence.",
  },
  {
    id: 2,
    message:
      "Want to share feedback anonymously? ZkBlind is your go-to platform! Our cutting-edge zero-knowledge protocols protect your identity while enabling honest and transparent communication.",
  },
  {
    id: 3,
    message:
      "Concerned about privacy in a digital world? ZkBlind has got you covered! Our zero-knowledge tools and libraries safeguard your personal information, ensuring complete anonymity.  ",
  },
  {
    id: 4,
    message:
      "Looking to build secure applications using zero-knowledge proofs and circuits? Look no further than ZkBlind! Our platform is dedicated to aiding developers in implementing technical solutions that prioritize user experience.",
  },
  {
    id: 5,
    message:
      "ZkBlind offers a unique opportunity to foster transparent communication and genuine feedback in the workplace. Our platform encourages an honest exchange of ideas without fear of retaliation.",
  },
  {
    id: 6,
    message:
      "Do you value your privacy and security? So do we! Embrace the future of confidential communication with ZkBlind and take control of your sensitive information.",
  },
  {
    id: 7,
    message:
      "Join the ZkBlind revolution and experience the ultimate level of anonymity and security in digital communication. Our advanced zero-knowledge technology is the solution you've been searching for!",
  },
];

type ZkBlindMessage = {
  id: number;
  message: string;
};

export default function Index() {
  const { classes, cx } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  // later improve the code to query the current chain
  const { chain } = useNetwork();
  // to import the contract address and abi for the current chain
  const { contractAddress, abi } = getContractInfo();

  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [messages, setMessages] = useState(demoMessages);
  const [isAllowed, setAllowed] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkUser() {
      if (address && signer) {
        const contract = new ethers.Contract(contractAddress, abi, signer);
        let isWhiteListed = await contract.verifyUser(address);
        setAllowed(isWhiteListed);
      }
    }

    checkUser();
  }, [signer, contractAddress, abi, address, isAllowed]);

  function postNewMessage() {
    let len = messages.length + 1;
    setMessages([...messages, { id: len, message: message }]);
  }

  return (
    <>
      {isAllowed ? (
        <>
          <Modal opened={opened} onClose={close} withCloseButton={true}>
            <TextInput
              placeholder="Your Message"
              size="md"
              radius="md"
              value={message}
              onChange={(event) => setMessage(event.currentTarget.value)}
            />
            <Button mt={10} onClick={() => postNewMessage()}>
              Post
            </Button>
          </Modal>
          <Grid columns={24}>
            <Grid.Col span={6}>
              <Image
                height={250}
                fit="contain"
                src="/Zkblind.png"
                alt="ZkBlind"
              />
              <Center>
                <Group position="center">
                  <Button mt={10} onClick={open}>
                    Message
                  </Button>
                </Group>
              </Center>
            </Grid.Col>
            <Grid.Col span={16}>
              {messages?.map((message: ZkBlindMessage) => (
                <>
                  <Paper
                    key={message.id}
                    mt={10}
                    shadow="sm"
                    p="md"
                    className={classes.post}
                    withBorder
                  >
                    {message.message}
                  </Paper>
                </>
              ))}
            </Grid.Col>
          </Grid>
        </>
      ) : (
        <Paper mt={10} shadow="sm" p="md" className={classes.error} withBorder>
          <Center>
            Please, <Link href="/whitelist"> Register </Link>
          </Center>
        </Paper>
      )}
    </>
  );
}
