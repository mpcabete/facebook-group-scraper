    // ================================================================ message handling
    // mudei esses parada pra cima antes de reparar no bug
    messageHandler=(msg,sender,response)=>{
        console.log(msg)
        if (msg.interaction==='gAnalysis'){
            console.log('currentState',currentState)
        if (currentState==='idle'){
            startGroupAnalysis(analysisMaxTime)
        }
        else if (currentState==='groupAnalysis'){
            clearTimeout(currentTimer)
            stopGroupAnalysis()
        }
        // todo: change to return if started or stopped
        response('gAnalysis')
        }

        else if (msg.interaction==='mAnalysis'){
            startMembersAnalysis()
            // todo: change to return if started or stopped
            response('mAnalysis')
        }


        else if (msg.interaction==='download'){
            
            console.log('download message')
            chrome.storage.local.get('members',({members})=>{
                const csv = generateCsv(members)
                response(csv)
            })
            return true
        }
        else if (msg.interaction==='memberData'){
            const data = msg.data
            const url = msg.ownUrl
            console.log('msg data: ',msg)
            onMemberData(url,data)
            
        }
    }
     


    // sends message to content script
    const sendMessage = (tabs,command,data={}) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: command,
            data:data
        }, (res) => console.log(res))
    }

  