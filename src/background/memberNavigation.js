self.startMembersAnalysis=()=>{
    // let queryOptions = {
    //     // active: true,
    //     currentWindow: true
    // }
    // chrome.tabs.query(queryOptions,(tabs)=>{chrome.scripting.executeScript({
    //     target:{tabId:tabs[2].id},
    //     function:()=>console.log('injected')
    // },
    // ()=>{}
    // )})


    // create tab
    chrome.storage.local.get('members',(response)=>{
        let start = 0
       const members = response.members
       chrome.tabs.create({url:members[start].url},(tab)=>{
         
       })

    })



    
}

self.onMemberData=(data,tabId,next)=>{
    chrome.tabs.update(tabId,{url:next})
    console.log(data)

}

// // ========================== would have to awayt url set to inject
// chrome.scripting.executeScript({
//     target:{tabId:tab.id},
//     function:()=>console.log('injected')
// },
// ()=>{}
// )

// permissions: "scripting"