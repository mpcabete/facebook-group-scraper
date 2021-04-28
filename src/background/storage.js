
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


    self.insertMember = (memberPacket)=>{
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
            console.log(members.length)
                }  
            )
            
    }   
