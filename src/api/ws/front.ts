// async function setData() {
//   // Llamar al servicio para setear los datos correspondientes.
// }

// function init() {
//   console.info("Websocket client connetion request")
//   wsConnect()
// }

// function wsConnect() {
//   websocket = new WebSocket("ws://localhost:8000")
//   websocket.onopen = function () {
//     console.log("✅WebSocket Client Connected")
//   };

//   websocket.onmessage = function (e) {
//     if (typeof e.data === "string") {
//       console.log('Recived Msg: ' + JSON.stringify(e.data))
//       onMessage(e)
//     }
//   }
// }

// function onOpen() {
//   doSend("Connection Open")
// }

// function onClose() {
//   setTimeout(function () {
//     wsConnect();
//   }, 2000);
// }

// async function onMessage(evt) {
//   let mensaje = evt.data;

//   const data = JSON.parse(mensaje)
//   console.log('DATA', data)

//   if (data.type === "NEW_ARN_STATUS") {
//     setData
//   }
// }

// function onError(evt) {
//   console.log("ERROR" + evt.data)
// }

// function doSend(message) {
//   console.log('WS SENT: ', message)
//   websocket.send(message)
// }

// window.addEventListener("load", init, false)
