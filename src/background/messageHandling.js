    // ================================================================ message handling
    // mudei esses parada pra cima antes de reparar no bug
    messageHandler=(msg,sender,response)=>{
        if (msg.interaction==='gAnalysis'){
            console.log('currentState',currentState)
        if (currentState==='idle'){
            startGroupAnalysis(analysisMaxTime)
        }
        else if (currentState==='groupAnalysis'){
            clearTimeout(currentTimer)
            stopGroupAnalysis()
        }
        response('gAnalysis')
        }


        if (msg.interaction==='download'){
            
            console.log('download message')
            chrome.storage.local.get('members',({members})=>{
                const csv = generateCsv(members)
                response(csv)
            })
            return true
        }
    }
     


    // sends message to content script
    const sendMessage = (tabs,command,data={}) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: command,
            data:data
        }, (res) => console.log(res))
    }

  