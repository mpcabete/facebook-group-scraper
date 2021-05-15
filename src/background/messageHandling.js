    // ================================================================ message handling
    // mudei esses parada pra cima antes de reparar no bug
    messageHandler=(msg,sender,response)=>{
      console.log('%c message recieved:',"color:green;",msg.interaction)
        if (msg.interaction==='gAnalysis'){
            console.log('currentState',currentState)
        if (currentState==='idle'){
            startGroupAnalysis(analysisMaxTime)
        }
        // ==========================================
        else if (currentState==='groupAnalysis'){
            clearTimeout(currentTimer)
            stopGroupAnalysis()
        }
        // todo: change to return if started or stopped
        response('gAnalysis')
        }
        // ==========================================
        else if (msg.interaction==='getCounts'){
          chrome.storage.local.get('members',(data)=>{
            if(data.members){
              const m = data.members.length
              const am = data.members.filter(m=>m.isChecked).length
              response({m,am})
            } 
          })
          return(true)
        }
        // ==========================================
        else if (msg.interaction==='mAnalysis'){
            if (self.currentState==='mAnalysis'){
                self.currentState = 'idle'
                return
            }else{
                self.currentState = 'mAnalysis'
            }
            startMembersAnalysis()
            // todo: change to return if started or stopped
            response('mAnalysis')
        }
        
        
        // ==========================================
        else if (msg.interaction==='download'){
            
            console.log('download message')
            chrome.storage.local.get('members',({members})=>{
                const csv = generateCsv(members)
                response(csv)
            })
            return true
        }
        // ==========================================
        else if (msg.interaction==='memberData'){
            if (self.currentState!=='mAnalysis'){
                console.log('not in analysis state, state = ',self.currentState)
            }
            const data = msg.data
            const url = msg.ownUrl
            const tabId = sender.tab.id

            onMemberData(url,data,tabId)
            response('state')
            
        }
        // ==========================================
        else if(msg.interaction==='stop'){
            if (self.currentState==='groupAnalysis'){
            clearTimeout(currentTimer)
            stopGroupAnalysis()
        }

            self.currentState='idle'

            response('stop')
        }
        // ==========================================
        else if(msg.interaction==='getState'){
            response(self.currentState)
        }
        // ==========================================
        else if(msg.interaction==='clear'){
            chrome.storage.local.get((r)=>{
                console.log('r',r)
                response(r?.members?.length ?? 0)
                chrome.storage.local.clear()
            })
            return(true)
        }
    }
     


    // sends message to content script
    const sendMessage = (tabs,command,data={}) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: command,
            data:data
        }, (res) => console.log(res))
    }

  
