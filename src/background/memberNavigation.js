self.startMembersAnalysis = () => {
    // create tab
    chrome.storage.local.get('members', (response) => {
        let start = 0
        const members = response.members
        chrome.tabs.create({
            url: members[start].url
        }, (tab) => {

        })

    })

}

self.onMemberData = (ownUrl,data, tabId) => {
    console.log(data)
    console.log('data: ',data)

    chrome.storage.local.get('members', (response) => {
        const members = response.members
        let next
        let isAdded = false
        // find item and get next
        for (m in members){
            console.log('urls:',members[m].url,'  :  ',ownUrl)
            if (members[m].url===ownUrl){
                console.log('found at: ',m)
                members[m].isChecked=true
                members[m].company = data
                isAdded = true
                console.log('new obj: ',members[m])
            }else if(!members[m].isChecked){
                next = members[m].url
                if(isAdded)break
            }
        }
        chrome.storage.local.set({members:members},()=>console.log('updated'))
        chrome.tabs.update(tabId, {
        url: next})
    })

    

    

}

// // ========================== would have to awayt url set to inject
// chrome.scripting.executeScript({
//     target:{tabId:tab.id},
//     function:()=>console.log('injected')
// },
// ()=>{}
// )

// permissions: "scripting"