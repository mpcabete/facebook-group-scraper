self.startGroupAnalysis = (analysisMaxTime)=>{
    console.log('starting analysis',currentTimer)
    currentState = 'groupAnalysis'

    // Inicia o debugger na aba ativa
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs)=>{
        startDebugger(tabs)
        sendMessage(tabs,'start')
        // log dos dados
        // TODO: se quiser ter mais de 1 rodando tem q mudar o escopo do current timer
        // currentTimer = setTimeout(()=>{
            // stopGroupAnalysis()
        // },analysisMaxTime)
    })


}

 // handles debugger events
 self.allEventHandler = ({ tabId }, message, params) => {
    // if(message === "Network.loadingFinished"){
    //   console.log(params.requestId)
    // }
    if (params.response===undefined)return
    const {requestId , response:{mimeType:type} } = params

    
    // se for evento de network e eh texto
    if (message == "Network.responseReceived" && type == 'text/javascript' && params.response.url==="https://www.facebook.com/api/graphql/") {

        // pega a resposta
        getResponseBody = ()=>{
          chrome.debugger.sendCommand({tabId: tabId}, "Network.getResponseBody", { "requestId": requestId }, parseBody)
              }
      //The ideal would be to wait the event loading finished for this ID be fired, but 100ms did the trick
              setTimeout(getResponseBody,100)
          }
      }

self.stopGroupAnalysis = ()=>{
    console.log('stoping analysis!',currentTimer)
    // o ideal eh o id da tab ser passado pra n dar problema se a pessoa mudar de aba no meio
    chrome.tabs.query({
            active: true,
            currentWindow: true
        }, (tabs)=>{
            removeDuplicates('members',(d)=>d.id)
            chrome.debugger.detach({tabId:tabs[0].id},()=>{});
            
            sendMessage(tabs,'stop')
        }
    )
    currentState = 'idle'
}


// atrach debugger to active tab
self.startDebugger = (tabs) => {
    
    var version = "1.0"; //??
    const currentTabID = tabs[0].id
    
    chrome.debugger.attach({ //debug at current tab
        tabId: currentTabID
    }, version, () => startAnalyzing(currentTabID))
    
}

  // start debugger and adds the listener
  self.startAnalyzing = (id) => {
    // liga o network e ouve os evento
    chrome.debugger.sendCommand({ //first enable the Network
        tabId: id
    }, "Network.enable");
    
    chrome.debugger.onEvent.addListener(allEventHandler);
}
