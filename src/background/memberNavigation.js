// create tab with url of a non checked member
self.startMembersAnalysis = () => {
    // create tab
    chrome.storage.local.get('members', (response) => {
        let start = response.members.filter(m=>m.isChecked).length+1
        if(start==response.members.length+1){
             console.log('no uncheked')
             self.currentState='idle'
             return
        }
        const members = response.members
        if(!members){
            // alert to the user that there are no members data
            return
        }
        chrome.tabs.create({
            url: members[start].url
        }, (tab) => {

        })

    })

}

self.onMemberData = (ownUrl,data, tabId) => {
	console.log('member data recived, changing url...')
	if (self.currentState!=='mAnalysis'){
		console.log('not in member analysis mode, returning...')
		return
    }
    // get members data
    chrome.storage.local.get('members', (response) => {
        const members = response.members
        let next
        let isAdded = false

        // find item and get next
        for (m in members){
            // console.log('urls:',members[m].url,'  :  ',ownUrl)
            if (members[m].url===ownUrl){
                //console.log('member found at: ',m)
                members[m].isChecked=true
                members[m].company = data
                isAdded = true
                // console.log('new obj: ',members[m])
            }else if(!members[m].isChecked){
                next = members[m].url
                if(isAdded)break
            }
        }
        // update storage data
        chrome.storage.local.set({members:members},()=>console.log('updated'))
        setTimeout(()=>{
            console.log('changing url...')
            if(!next){
                console.log('done')
                return
            }
            chrome.tabs.update(tabId, {
                url: next})
            console.log("url updated")
            },500)
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
