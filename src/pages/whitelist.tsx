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
  Col,
  Textarea
} from "@mantine/core";
import { ArrowLeft, Heart } from "tabler-icons-react";
import { BiDislike } from "react-icons/bi";
import { FaLaughSquint } from "react-icons/fa";
import React, { useState, useEffect, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { addWhitelistTransaction, checkWhitelisted } from "@/lib/addWhitelistTransaction";
// import your ethers.js setup and contract instance here

export default function Whitelist() {
  const [proofInput, setProofInput] = useState("");
  const [pubInput, setPubInput] = useState("");
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  useEffect(() => {
    const fetchUserStatus = async () => {
      const whiteRes = await checkWhitelisted();
      setIsWhitelisted(whiteRes);
    };

    fetchUserStatus();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("enter handleSubmit...");
    try {
      notifications.show({
        message: "Add whitelist.Submitting transaction...",
        color: "green",
      });

      const parsedPubInput = JSON.parse(pubInput);
      const userId = parsedPubInput.userId;
      const emailSuffix = parsedPubInput.emailSuffix;

      
      console.log("userId...", userId);
      console.log("emailSuffix...", emailSuffix);
      // Write the transaction
      const txResult = await addWhitelistTransaction(proofInput, userId, emailSuffix);
      const txHash = txResult;
      console.log("txHash...", txHash);

      notifications.show({
        message: `Transaction succeeded! Tx Hash: ${txHash}`,
        color: "green",
        autoClose: false,
      });
    } catch (err: any) {
      const statusCode = err?.response?.status;
      const errorMsg = err?.response?.data?.error;
      notifications.show({
        message: `Error ${statusCode}: ${errorMsg}`,
        color: "red",
      });
    }
  };

  return (
    <Container>
      {isWhitelisted ? (
        <Text>Current user had whitelisted.</Text>
      ) : (
      <form onSubmit={handleSubmit}>
        <Grid>
          <Col>
            <Textarea
              label="Proof Input"
              value={proofInput}
              onChange={(event) => setProofInput(event.currentTarget.value)}
              required
            />
          </Col>
          <Col>
            <Textarea
              label="Public Input"
              value={pubInput}
              onChange={(event) => setPubInput(event.currentTarget.value)}
              required
            />
          </Col>
        </Grid>
        <Grid>
          <Col>
            <Button type="submit">Submit</Button>
          </Col>
        </Grid>
      </form>
      )}
    </Container>
  );
}