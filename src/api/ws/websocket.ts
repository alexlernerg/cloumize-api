// const WebSocket = require('ws')
// const wss = new WebSocket.Server({ port: 8000 })
// const clients = new Map()
// export default (): void => {
//   wss.on('connection', async ws => {
//     const id = ws.req.token.id || 0
//     // condition ws.origin--> their API
//     // ws.request.origin
//     clients.set(ws, id)

//     console.log('NEW CONNECTION, TOTAL PEERS CONNECTED: ', [...clients.keys()].length)
//     ws.send(JSON.stringify({ type: 'CONNECTED', id }));

//     [...clients.keys()].forEach(client => {
//       const peer = clients.get(client)
//       const clone = JSON.parse(JSON.stringify(peer))
//       delete clone.privateKey
//       publicData.push(clone)
//     });

//     [...clients.keys()].forEach((client) => {
//       client.send(JSON.stringify({ type: 'NEW_PEER', peer: id, data: publicData }))
//     })

//     ws.on('message', async (incomingMessage) => {
//       const msg = JSON.parse(incomingMessage)
//       const { type, amount, to } = msg
//       const id = clients.get(ws)
//       if (id === 0){

//       }

//       const tx = new Transaction(publicKey, to, amount, chain.transactionCount + 1)

//       const sendMsg = (msg: string): void => {
//         ;[...clients.keys()].forEach(client => {
//           client.send(msg)
//         })
//       }

//       const updateBalances = (): void => {
//         ;[...clients.keys()].forEach(client => {
//           const clientData = clients.get(client)
//           // console.log('balances son', clientData, chain.getBalanceOfAddress(clientData.publicKey))
//           client.send(JSON.stringify({ type: 'NEW_BALANCE', data: chain.getBalanceOfAddress(clientData.publicKey) }))
//         })
//       }

//       switch (type) {
//         case 'BALANCE':
//           ws.send(JSON.stringify(chain.getBalanceOfAddress(publicKey)))
//           break;

//         case 'ADD_TRANSACTION':
//           tx.signTransaction(ec.keyFromPrivate(privateKey))
//           chain.addTransaction(tx)
//           sendMsg(JSON.stringify({ type: 'NEW_TRANSACTION', data: chain.pendingTransactions }))
//           ws.send(JSON.stringify({ type: 'NEW_BALANCE', data: chain.getBalanceOfAddress(publicKey) }))
//           break;

//         case 'PENDING_BLOCK':
//           const blockData = await chain.pendingBlock(publicKey)
//           blockData.difficulty = chain.difficulty
//           ws.send(JSON.stringify({ type: 'PENDING_BLOCK', data: blockData }))
//           break;

//         case 'MINED_BLOCK':
//           // console.log('THE MINED BLOCK IS:', msg.data.block, msg.data.nonce)
//           await chain.testMinedBlock(msg.data.block, msg.data.nonce)
//           sendMsg(JSON.stringify({ type: 'NEW_CHAIN', peer: id, data: chain }))
//           sendMsg(JSON.stringify({ type: 'NEW_TRANSACTION', data: chain.pendingTransactions }))
//           updateBalances()
//           break

//         default:
//           break
//       }
//     })

//     ws.on('close', () => {
//       clients.delete(ws)
//     })

//   })

//   console.log('WSS UP AND RUNNING ON PORT 8000')

// }
