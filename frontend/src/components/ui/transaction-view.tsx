/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Link, Table, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import axios from 'axios'
import { toaster } from './toaster'
import { formatAddress, formatNumber } from '@/utils'
import moment from 'moment'

const apiUrl = import.meta.env.VITE_API_END_POINT

interface TransactionType {
 _id: string
 transactionHash: string
 blockNumber: number
 from: string
 gasPrice: {
  value: string
  unit: string
 }
 timestamp: number
 to: string
 value: number
}

const getTransactionHistory = async (
 address: `0x${string}` | undefined,
 pageOptions: { index?: number; size?: number } = { index: 1, size: 10 },
) => {
 try {
  const response = await axios.get(
   `${apiUrl}/token/${address}/history?index=${pageOptions.index}&size=${pageOptions.size}`,
  )
  if (response?.data?.data) {
   return response.data.data
  }
  return []
 } catch (error) {
  toaster.create({
   title: `Error fetching transactions: ${error}`,
   type: 'error',
  })
  return []
 }
}

const LastTransactions = () => {
 const { address } = useAccount()
 const [transactions, setTransactions] = useState<TransactionType[]>([])

 useEffect(() => {
  let interval: NodeJS.Timeout

  if (address) {
   const loadTransactions = async () => {
    const txs = await getTransactionHistory(address)
    setTransactions(txs)
   }

   loadTransactions()

   interval = setInterval(loadTransactions, 5000)
  }

  return () => {
   if (interval) {
    clearInterval(interval)
   }
  }
 }, [address])

 if (!address) {
  return (
   <Box px={8} py={4} fontSize={20} fontWeight={600} color={'red.600'}>
    Please connect your wallet
   </Box>
  )
 }

 function formatLastPrice(lastPrice: number): React.ReactNode {
  if (lastPrice === 0) {
   return <>$0.00</>
  }
  const scientificNotation = lastPrice.toExponential()
  const [base, exponent] = scientificNotation.split('e')

  const absExponent = Math.abs(Number(exponent))
  const zerosCount = absExponent - base.split('.')[0]?.length || 0

  const significantPart = base.replace('.', '')

  return (
   <>
    0.0<sub>{zerosCount}</sub>
    {significantPart.slice(0, 2)}
   </>
  )
 }

 return (
  <Box px={8}>
   <Text fontSize={24} py={2} fontWeight={600}>
    Last 10 Transactions
   </Text>
   <Table.Root size="sm" borderRadius={10}>
    <Table.Header>
     <Table.Row>
      <Table.ColumnHeader color="white">Tx Hash</Table.ColumnHeader>
      <Table.ColumnHeader color="white">Block</Table.ColumnHeader>
      <Table.ColumnHeader color="white">Age</Table.ColumnHeader>
      <Table.ColumnHeader color="white">From</Table.ColumnHeader>
      <Table.ColumnHeader color="white">To</Table.ColumnHeader>
      <Table.ColumnHeader color="white">Amount</Table.ColumnHeader>
      <Table.ColumnHeader color="white">Gas Fee</Table.ColumnHeader>
     </Table.Row>
    </Table.Header>
    {transactions?.length > 0 ? (
     <Table.Body>
      {transactions.map((item) => (
       <Table.Row
        key={item._id}
        bg={'whiteAlpha.400'}
        _hover={{ bg: 'gray.100', cursor: 'pointer' }}
        transition="background-color 0.2s ease"
        onClick={() =>
         window.open(
          `https://sepolia.etherscan.io/tx/${item.transactionHash}`,
          '_blank',
         )
        }
       >
        <Table.Cell color={'black'}>
         <Text py={1}>
          <Link
           color={'black'}
           textDecoration={'underline'}
           href={`https://sepolia.etherscan.io/tx/${item.transactionHash}`}
           target="_blank"
          >
           {formatAddress(item.transactionHash, 10)}
          </Link>
         </Text>
        </Table.Cell>
        <Table.Cell color={'black'}>{item.blockNumber}</Table.Cell>
        <Table.Cell color={'black'}>
         {moment(item.timestamp * 1000).fromNow()}
        </Table.Cell>
        <Table.Cell color={'black'}>{formatAddress(item.from)}</Table.Cell>
        <Table.Cell color={'black'}>{formatAddress(item.to)}</Table.Cell>
        <Table.Cell color={'black'}>{formatNumber(item.value)}</Table.Cell>
        <Table.Cell color={'black'}>
         {formatLastPrice(Number(item.gasPrice.value))} {item.gasPrice.unit}
        </Table.Cell>
       </Table.Row>
      ))}
     </Table.Body>
    ) : (
     <Table.Row>
      <Table.Cell
       colSpan={7}
       fontSize={18}
       fontWeight={600}
       textAlign="center"
       py={6}
       color="black"
       bg={'white'}
      >
       No transactions found
      </Table.Cell>
     </Table.Row>
    )}
   </Table.Root>
  </Box>
 )
}

export default LastTransactions
