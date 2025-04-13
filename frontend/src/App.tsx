import "./App.css";
import { Box, Text } from "@chakra-ui/react";
import { WalletOptions } from "./components/ui/connect-wallet";
import UserTransactions from "./components/ui/transaction-view";
import HomeAction from "./components/ui/home-action";

function App() {
  return (
    <div>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems="center"
        px={8}
        py={2}
        backgroundColor={"white"}
        borderBottom={"1px solid gray"}
      >
        <Text fontSize={30} fontWeight={700}>
          Logo
        </Text>
        <WalletOptions />
      </Box>
      <Box>
        <UserTransactions />
      </Box>
      <HomeAction />
    </div>
  );
}

export default App;
