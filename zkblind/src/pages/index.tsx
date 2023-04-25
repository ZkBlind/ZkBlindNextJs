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
} from "@mantine/core";
import { ArrowLeft, Heart } from "tabler-icons-react";
import { BiDislike } from "react-icons/bi";
import { FaLaughSquint } from "react-icons/fa";
import React, { useState, useEffect, useMemo } from "react";

export default function Index() {
  const [reaction, setReaction] = useState<string>();
  const [isEncrypted, setIsEncrypted] = useState(false);

  const [newMessage, setNewMessage] = useState<string>();
  const [messages, setMessages] = useState<any | undefined>();

  return (
    <Grid columns={24}>
      <Grid.Col span={6}>
        <Image
          height={250}
          fit="contain"
          src="https://evm.pinsave.app/PinSaveCard.png"
          alt=""
        />
      </Grid.Col>
      <Grid.Col span={16}>
        <Paper shadow="sm" p="md" withBorder></Paper>
      </Grid.Col>
    </Grid>
  );
}
