import {
  Text,
  Button,
  Container,
  Grid,
  Col,
  Textarea,
  LoadingOverlay,
} from "@mantine/core";
import React, { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useAccount } from "wagmi";
import {
  addWhitelistTransaction,
  checkWhitelisted,
} from "@/lib/addWhitelistTransaction";

export default function Whitelist() {
  const [proofInput, setProofInput] = useState<string>("");
  const [pubInput, setPubInput] = useState<string>("");
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const [isPosted, setIsPosted] = useState<boolean>(false);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const { address } = useAccount();

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (address) {
        const whiteRes = await checkWhitelisted(address);
        setIsWhitelisted(whiteRes);
      }
      setLoaded(true);
    };

    fetchUserStatus();
  }, [isPosted, address]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      notifications.show({
        message: "Add whitelist. Submitting transaction...",
        color: "green",
      });

      const parsedPubInput = JSON.parse(pubInput);
      const input = parsedPubInput.input;
      const userId = parsedPubInput.userId;
      const emailSuffix = parsedPubInput.emailSuffix;

      const parsedProofInput = JSON.parse(proofInput);
      const a = parsedProofInput.a;
      const b = parsedProofInput.b;
      const c = parsedProofInput.c;

      /*       console.log("a...", a);
      console.log("b...", b);
      console.log("c...", c);
      console.log("input...", input);
      console.log("userId...", userId);
      console.log("emailSuffix...", emailSuffix); */
      const txHash = await addWhitelistTransaction(
        a,
        b,
        c,
        input,
        userId,
        emailSuffix
      );

      setIsPosted(true);
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
    <>
      {!isLoaded ? (
        <LoadingOverlay
          loaderProps={{ size: "sm", color: "pink", variant: "bars" }}
          overlayOpacity={0.3}
          overlayColor="#c5c5c5"
          visible
        />
      ) : (
        <Container>
          {isWhitelisted ? (
            <Text>Current user had whitelisted.</Text>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid>
                <Col>
                  <Textarea
                    minRows={12}
                    label="Proof Input"
                    value={proofInput}
                    onChange={(event) =>
                      setProofInput(event.currentTarget.value)
                    }
                    required
                  />
                </Col>
                <Col>
                  <Textarea
                    minRows={20}
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
      )}
    </>
  );
}
