try {
    // console.log('Background Script:')
    let allData = []
    const analysisTime = 5*60*1000


    const startDebugger = (tabs) => {
        var version = "1.0"; //??
        const currentTabID = tabs[0].id

        chrome.debugger.attach({ //debug at current tab
            tabId: currentTabID
        }, version, () => startAnlizing(currentTabID))

    }



    function allEventHandler(responseId, message, params) {
        if (params.response===undefined){
            // console.log('no params')
            return
        }
        const { tabId } = responseId
        const {requestId , response:{mimeType:type} } = params
        // console.log('event: ', message)


        // if (currentTab.id != tabId) {
        //     // se o request for de outra aba
            // console.log('Request Id Is not from active tab.')
        //     return;
        // }
        
        // se for evento de network
        if (message == "Network.responseReceived") {
            // console.log('TabID: ',tabId)
            // console.log('requestID: ', requestId)

            if (type !== 'text/javascript') return

            // pega a resposta
            chrome.debugger.sendCommand({
                tabId: tabId
            }, "Network.getResponseBody", {
                "requestId": requestId
            }, parseBody)
        }

    }

    const parseBody =(response) => {
        if(response===undefined){
            // console.log('No body')
            return
        }
        const junk = "for (;;);"
        let {body} = response

        if (body.substr(0,junk.length)===junk){
            body = body.substr(junk.length)
            // console.log('Junk Removed!')
        }
        // console.log('body: ',body)
        let data
        try {
            data = JSON.parse(body)
        } catch (e){console.error('erro no parse: ', e)
        }

        extractInfo(data)
        // you can close the debugger tips by:
        // chrome.debugger.detach(responseId);
    }

    extractInfo=(data)=>{
        const isGroupData = data?.data?.node?.__typename === 'Group'
        if (isGroupData){
            const usersData = data.data.node.new_members.edges.map(e=>e.node)
            // console.log(usersData)
            allData = allData.concat(usersData)


            // console.log('getUsers: ',console.log(data.data.node))
        }

    }

    // const getData = (obj)=>{

    // }

    const sendMessage = (tabs,command,data={}) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: command,
            data:data
        }, (res) => console.log(res))
    }

    generateCsv = (data)=>{
        const header = 'name,bio,url,type'
        let csv = [header]
        data.forEach(d=>{
            const{name,bio_text, url, __isProfile:type} = d
            let bio = '--'
            if (bio_text?.text){
                bio = bio_text.text
            }
            // TODO:se for gerar csv memo tem q substituir as , antes ou ver se \, continua fudendo

            const line = [name,bio,url,type].map(x=>x.replace(/,/g,' ')).join(',')
            csv.push(line)
            
        })
        // console.log(csv.join('\n'))
        return csv.join('\n')
    }

    const click = (e) => {
        // Inicia o debugger na aba ativa
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, (tabs)=>{
            startDebugger(tabs)
            sendMessage(tabs,'start')
            // log dos dados
            setTimeout(()=>{
                console.log('stop signal')
                const csv = generateCsv(allData)
                // TODO: tirar debugger
                // chrome.debugger.detach(tabs[0].id);
                sendMessage(tabs,'stop',csv)
            },analysisTime)
        })

        
    }


    // const haldler = (details) => {
        // console.log('onBeforeRequest', details)
    // }
    // chrome.webRequest.onCompleted.addListener(haldler, {
    //     urls: ["*://*.facebook.com/*"]
    // }, );

    const startAnlizing = (id) => {
        // liga o network e ouve os evento
        chrome.debugger.sendCommand({ //first enable the Network
            tabId: id
        }, "Network.enable");

        chrome.debugger.onEvent.addListener(allEventHandler);
    }

    chrome.action.onClicked.addListener((e) => click(e))
} catch {
    e => console.error(e)
}