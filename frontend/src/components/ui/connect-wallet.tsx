import { formatAddress } from "@/utils";
import { Box, Button, Popover, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import {
  Connector,
  CreateConnectorFn,
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { toaster } from "@/components/ui/toaster";

export function WalletOptions() {
  const { connectors, connect, error: connectError } = useConnect();
  const { address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const result = useBalance({
    address,
  });

  const handleConnectAndSwitch = async (
    connector: Connector<CreateConnectorFn>
  ) => {
    await connect({ connector });
  };

  useEffect(() => {
    if (connectError) {
      toaster.create({
        description: connectError.message,
        type: "error",
      });
    }
  }, [connectError]);

  useEffect(() => {
    if (chainId !== sepolia.id && switchChain) {
      switchChain({ chainId: sepolia.id });
    }
  }, [chainId, switchChain]);

  if (address) {
    return (
      <Box display={"flex"} gap={8} alignItems={"center"}>
        <Text fontWeight={600}>
          Balance:{" "}
          {result.data
            ? `${Number(result?.data?.formatted)?.toFixed(4)} ${
                result?.data?.symbol
              }`
            : 0}
        </Text>
        <Popover.Root>
          <Popover.Trigger
            colorPalette="teal"
            color="teal.400"
            _focus={{ outline: "none" }}
          >
            {formatAddress(address)}
          </Popover.Trigger>
          <Popover.Positioner _focus={{ outline: "none" }}>
            <Popover.Content _focus={{ outline: "none" }}>
              <Popover.Arrow>
                <Popover.ArrowTip />
              </Popover.Arrow>
              <Popover.Body>
                <Box
                  color="red.400"
                  cursor="pointer"
                  onClick={() => disconnect()}
                >
                  Disconnect
                </Box>
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>
      </Box>
    );
  }

  return (
    <Button
      colorPalette="teal"
      variant="outline"
      _focus={{ outline: "none" }}
      key={connectors[0].uid}
      onClick={() => handleConnectAndSwitch(connectors[0])}
    >
      Connect wallet
    </Button>
  );
}
