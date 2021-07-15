// create tab with url of a non checked companie
self.startCompaniesAnalysis = () => {
    // create tab
    chrome.storage.local.get('companies', (response) => {

        // find
        const companies = response.companies
        let start = companies.filter(m=>m.isChecked).length+1

        const noUncheckedCompanies = start==response.companies.length+1
        if(noUncheckedCompanies){
            console.log('no unchecked companies')
             self.currentState='idle'
             return
        }

        if(!companies){
            // alert to the user that there are no companies data
            return
        }

        chrome.tabs.create({
            url: companies[start].url+'about'
        }, (tab) => {

        })


    })

}

self.onCompanyData = (ownUrl,data, tabId) => {
	console.log('company data recived, changing url...')
  console.log('data',data)
	if (self.currentState!=='cAnalysis'){
		console.log('not in company analysis mode, returning...')
		return
    }
    // get members data
    chrome.storage.local.get(['members','companies'], (response) => {
        const members = response.members;
        const companies = response.companies ?? [];
        let next;
        let isAdded = false;

        // find item and get next
        for (c in companies) {
          if (companies[c].url+'about' === ownUrl) {
            companies[c].isChecked = true;
            companies[c].data = data;
            isAdded = true;

          } else if (!companies[c].isChecked) {
            next = companies[c].url;
            if (isAdded) break;
          }
        }

        // update storage data
        chrome.storage.local.set({ companies: companies }, () =>{})
        // chrome.storage.local.set({ members: members }, () =>
       //    console.log("updated")
       //  );
        setTimeout(() => {
          console.log("changing url...");
          if (!next) {
            console.log("done");
            return;
          }
          chrome.tabs.update(tabId, {
            url: next+'about',
          });
          console.log("url updated");
        }, 500);
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
