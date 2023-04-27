import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  SimpleGrid,
  Paper,
  Avatar,
  TextInput,
  Switch,
  Container,
  Grid,
  Center,
} from "@mantine/core";
import { ArrowLeft, Heart } from "tabler-icons-react";
import { BiDislike } from "react-icons/bi";
import { FaLaughSquint } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getContractInfo } from "@/utils/contracts";

const messages = [
  { id: 1, message: "bla" },
  { id: 2, message: "bla" },
  { id: 3, message: "bla" },
  { id: 4, message: "bla" },
  { id: 5, message: "bla" },
  { id: 6, message: "bla" },
  { id: 7, message: "bla" },
];

type ZkBlindMessage = {
  id: number;
  message: string;
};

export default function Index() {
  const { contractAddress, abi } = getContractInfo();
  const { address } = useAccount();
  const [isAllowed, setAllowed] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      console.log(address);
      // call contract here
      setAllowed(true);
    }
  }, [address, isAllowed]);

  return (
    <>
      {isAllowed ? (
        <Grid columns={24}>
          <Grid.Col span={6}>
            <Image
              height={250}
              fit="contain"
              src="/Zkblind.png"
              alt="ZkBlind"
            />
            <Center>
              <Button mt={10}>New message</Button>
            </Center>
          </Grid.Col>
          <Grid.Col span={16}>
            {messages.map((message: ZkBlindMessage) => (
              <Paper key={message.id} mt={10} shadow="sm" p="md" withBorder>
                {message.message}
              </Paper>
            ))}
          </Grid.Col>
          )
        </Grid>
      ) : (
        <Text> Please Register </Text>
      )}
    </>
  );
}
