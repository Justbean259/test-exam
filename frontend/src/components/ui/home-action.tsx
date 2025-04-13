import {
 Box,
 Button,
 CloseButton,
 Dialog,
 Input,
 Portal,
 Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {
 useAccount,
 useBalance,
 useWaitForTransactionReceipt,
 useWriteContract,
} from 'wagmi'
import MyToken from '../../contract/MyToken.json'
import { toaster } from './toaster'
import { formatNumber } from '@/utils'

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS

const HomeAction = () => {
 const [inputValue, setInputValue] = useState<
  { [key: string]: string } | undefined
 >()
 const { address } = useAccount()
 const [showMint, setShowMint] = useState<boolean>(false)
 const [loadingMint, setShowLoadingMint] = useState<boolean>(false)
 const [showTransfer, setShowTransfer] = useState<boolean>(false)
 const [loadingTransfer, setLoadingTransfer] = useState<boolean>(false)
 const [transactionComplete, setTransactionComplete] = useState<boolean>(true)
 const {
  data: mintData,
  isError: isErrorMint,
  writeContract,
 } = useWriteContract()

 const resultBalance = useBalance({
  address: address,
  token: contractAddress,
 })

 const { isSuccess, isError, error } = useWaitForTransactionReceipt({
  hash: mintData,
 })

 const onChangeValue = (key: string, value: string) => {
  const clone = { ...inputValue }
  clone[key] = value
  setInputValue(clone)
 }

 useEffect(() => {
  if (isSuccess && !transactionComplete) {
   toaster.create({
    title: showTransfer
     ? 'Transfer token successfully'
     : `Mint token successfully`,
    type: 'success',
   })
   setShowMint(false)
   setShowLoadingMint(false)
   setLoadingTransfer(false)
   setShowTransfer(false)
   setTransactionComplete(true)
  }
  if ((isErrorMint || isError) && !transactionComplete) {
   let message = 'Error occurred while processing the transaction'
   if (error) {
    if ('shortMessage' in error && error.shortMessage) {
     message = error.shortMessage
    } else if (error.message?.includes('execution reverted:')) {
     const parts = error.message.split('execution reverted: ')
     if (parts[1]) message = parts[1].split('"')[0]
    }
   }
   toaster.create({
    title: `Failed: ` + message,
    type: 'error',
   })
   setShowMint(false)
   setShowLoadingMint(false)
   setLoadingTransfer(false)
   setShowTransfer(false)
   setTransactionComplete(true)
  }
 }, [isError, isErrorMint, isSuccess, showTransfer, transactionComplete])

 const onTransferToken = () => {
  setLoadingTransfer(true)
  const amount = Number(inputValue?.['transferAmount'] || 0) * Math.pow(10, 18)
  const addressTo = inputValue?.['address']
  writeContract({
   abi: MyToken.abi,
   address: contractAddress,
   functionName: 'transfer',
   args: [addressTo, amount],
  })
  setTransactionComplete(false)
 }

 const onMintToken = () => {
  setShowLoadingMint(true)
  const amount = Number(inputValue?.['mintAmount'] || 0) * Math.pow(10, 18)
  writeContract({
   abi: MyToken.abi,
   address: contractAddress,
   functionName: 'mint',
   args: [amount],
  })
  setTransactionComplete(false)
 }

 return (
  <Box
   position={'fixed'}
   display={'flex'}
   gap={3}
   justifyContent={'center'}
   px={8}
   py={2}
   bottom={0}
   left={0}
   width={'100%'}
   background={'white'}
   borderTop={'1px solid gray'}
  >
   <Dialog.Root open={showTransfer}>
    {address && (
     <Dialog.Trigger padding={0}>
      <Button
       colorPalette="teal"
       variant="outline"
       _focus={{ outline: 'none' }}
       onClick={() => setShowTransfer(!showTransfer)}
      >
       Transfer token
      </Button>
     </Dialog.Trigger>
    )}
    <Portal>
     <Dialog.Backdrop />
     <Dialog.Positioner>
      <Dialog.Content backgroundColor={'white'}>
       <Dialog.Header>
        <Dialog.Title>Transfer token</Dialog.Title>
       </Dialog.Header>
       <Dialog.Body>
        <Box>
         <Text>Address(to):</Text>
         <Input
          mt={2}
          value={inputValue?.['address']}
          variant="outline"
          placeholder="Enter address..."
          onChange={(e) => onChangeValue('address', e?.target?.value)}
         />
         <Text
          mt={5}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
         >
          Amount:
          <Text fontSize={12}>
           (balance: {formatNumber(Number(resultBalance.data?.formatted || 0))}{' '}
           {resultBalance?.data?.symbol})
          </Text>
         </Text>
         <Input
          mt={2}
          variant="outline"
          type="number"
          value={inputValue?.['transferAmount']}
          placeholder="Enter amount..."
          min={0}
          max={resultBalance.data?.formatted}
          onChange={(e) => {
           if (Number(e?.target?.value) < 0) return
           onChangeValue('transferAmount', e?.target?.value)
          }}
         />
        </Box>
       </Dialog.Body>
       <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
         <Button
          variant="outline"
          colorPalette={'red'}
          onClick={() => setShowTransfer(false)}
         >
          Cancel
         </Button>
        </Dialog.ActionTrigger>
        <Button
         colorPalette="teal"
         variant="outline"
         loading={loadingTransfer}
         disabled={
          !inputValue?.['address'] ||
          !inputValue?.['transferAmount'] ||
          Number(inputValue?.['transferAmount']) <= 0
         }
         onClick={() => onTransferToken()}
        >
         Transfer
        </Button>
       </Dialog.Footer>
       <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" onClick={() => setShowTransfer(false)} />
       </Dialog.CloseTrigger>
      </Dialog.Content>
     </Dialog.Positioner>
    </Portal>
   </Dialog.Root>
   <Dialog.Root open={showMint}>
    {address && (
     <Dialog.Trigger padding={0}>
      <Button
       colorPalette="teal"
       variant="outline"
       _focus={{ outline: 'none' }}
       onClick={() => setShowMint(!showMint)}
      >
       Mint token
      </Button>
     </Dialog.Trigger>
    )}

    <Portal>
     <Dialog.Backdrop />
     <Dialog.Positioner>
      <Dialog.Content backgroundColor={'white'}>
       <Dialog.Header>
        <Dialog.Title>Mint token</Dialog.Title>
       </Dialog.Header>
       <Dialog.Body>
        <Box>
         <Text
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
         >
          Amount:
          <Text fontSize={12}>
           (balance: {formatNumber(Number(resultBalance.data?.formatted || 0))}{' '}
           {resultBalance?.data?.symbol})
          </Text>
         </Text>
         <Input
          mt={2}
          variant="outline"
          type="number"
          value={inputValue?.['mintAmount']}
          min={1}
          placeholder="Enter amount..."
          onChange={(e) => onChangeValue('mintAmount', e?.target?.value)}
         />
        </Box>
       </Dialog.Body>
       <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
         <Button
          variant="outline"
          colorPalette={'red'}
          onClick={() => setShowMint(false)}
         >
          Cancel
         </Button>
        </Dialog.ActionTrigger>
        <Button
         color="teal.300"
         variant="outline"
         loading={loadingMint}
         disabled={
          !inputValue?.['mintAmount'] || Number(inputValue?.['mintAmount']) <= 0
         }
         onClick={() => onMintToken()}
        >
         Mint
        </Button>
       </Dialog.Footer>
       <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" onClick={() => setShowMint(false)} />
       </Dialog.CloseTrigger>
      </Dialog.Content>
     </Dialog.Positioner>
    </Portal>
   </Dialog.Root>
  </Box>
 )
}

export default HomeAction
