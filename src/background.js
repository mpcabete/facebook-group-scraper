try {
    let allData = []
    const analysisMaxTime = 0.1*60*1000
    let currentState = 'idle'
    let currentTimer

 
    // ================================================================ storage manipulation
    const removeDuplicates = (key,acessor)=>{
        chrome.storage.local.get(key,(result)=>{
            if(result[key]===undefined){console.log('no data...');return}
            const data = result[key]
            const ids = data.map(d=>acessor(d))
            const filteredData = data.filter((c,i)=>{
                const id = acessor(c)
                return ids.indexOf(id) === i
            })
            
            chrome.storage.local.set({[key]:filteredData},()=>console.log('Removed ',data.length-filteredData.length,' duplicates'))
        })
    }
    // ================================================================ response parsing 
    // handles debugger events
    const allEventHandler = ({ tabId }, message, params) => {
        if (params.response===undefined)return
        const {requestId , response:{mimeType:type} } = params

        
        // se for evento de network e eh texto
        if (message == "Network.responseReceived" && type == 'text/javascript') {

            // pega a resposta
            chrome.debugger.sendCommand({tabId: tabId}, "Network.getResponseBody", { "requestId": requestId }, parseBody)
        }
    }

    // parses network response body
    const parseBody =(response) => {
        if (chrome.runtime.lastError) {
            console.log('response error: ',chrome.runtime.lastError)
        }
        if(response===undefined){
            // console.log('No response')
            return
        }

        let {body} = response

        // remove facebook's junk
        const junk = "for (;;);"

        if (body.substr(0,junk.length)===junk){
            body = body.substr(junk.length)
            // console.log('Junk Removed!')
            
        }

        let data
        try {
            data = JSON.parse(body)
        } catch (e){console.error('response body parsing error: ', e)
        }

        extractMemberInfo(data)
        // you can close the debugger tips by:
        // chrome.debugger.detach(responseId);
    }

    // get user info from response object
    const extractMemberInfo=(data)=>{
        const isGroupData = data?.data?.node?.__typename === 'Group'
        if (isGroupData){
            const usersData = data.data.node.new_members.edges.map(e=>e.node)

            // add user data to storage
            
            allData = allData.concat(usersData)
            insertMember(usersData)

            // console.log('getUsers: ',console.log(data.data.node))
        }

    }

    const insertMember = (memberPacket)=>{
        chrome.storage.local.get('members',(result)=>{
            if (chrome.runtime.lastError) {
                console.log('storage error: ',chrome.runtime.lastError)
            }
            let members
            if (result?.members===undefined) {
                console.log('initializing members array')
                members = []
            }else{members = result.members}

            members.push(...memberPacket)
            chrome.storage.local.set({members:members},()=>console.log('members setted'))
            console.log(members)
                }  
            )
            
    }   

    


    // ================================================================ messages
    // sends message to content script
    const sendMessage = (tabs,command,data={}) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: command,
            data:data
        }, (res) => console.log(res))
    }

    
    // action click handler
    const click = (e) => {
        console.log('currentState',currentState)
        if (currentState==='idle'){
            startGroupAnalysis(analysisMaxTime)
        }
        else if (currentState==='groupAnalysis'){
            clearTimeout(currentTimer)
            stopGroupAnalysis()
        }
        
        
    }
    // ========================================================================== csv
    // converts data into csv format
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

    // ========================================== debugger

    const startGroupAnalysis = (analysisMaxTime)=>{
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
            currentTimer = setTimeout(()=>{
                stopGroupAnalysis()
            },analysisMaxTime)
        })


    }

    const stopGroupAnalysis = ()=>{
        console.log('stoping analysis!',currentTimer)
        // o ideal eh o id da tab ser passado pra n dar problema se a pessoa mudar de aba no meio
        chrome.tabs.query({
                active: true,
                currentWindow: true
            }, (tabs)=>{
                removeDuplicates('members',(d)=>d.id)
                console.log('dttid',tabs[0].id)
                chrome.debugger.detach({tabId:tabs[0].id},()=>{});
                
                const csv = generateCsv(allData)
                // TODO: tirar debugger
                // chrome.debugger.detach(tabs[0].id);
                sendMessage(tabs,'stop',csv)
            }
        )
        currentState = 'idle'
    }


    // atrach debugger to active tab
    const startDebugger = (tabs) => {
        
        var version = "1.0"; //??
        const currentTabID = tabs[0].id
        console.log('attid',currentTabID)
        
        chrome.debugger.attach({ //debug at current tab
            tabId: currentTabID
        }, version, () => startAnalyzing(currentTabID))
        
    }
    
    
    // start debugger and adds the listener
    const startAnalyzing = (id) => {
        // liga o network e ouve os evento
        chrome.debugger.sendCommand({ //first enable the Network
            tabId: id
        }, "Network.enable");
        
        chrome.debugger.onEvent.addListener(allEventHandler);
    }
    
    // adds click event to icon
    chrome.action.onClicked.addListener((e) => click(e))
    
    
} catch {
    e => console.error(e)
}