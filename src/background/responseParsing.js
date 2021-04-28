  // parses network response body
  const parseBody =(response) => {
    if (chrome.runtime.lastError) {
        console.log('response error: ',chrome.runtime.lastError)
    }
    if(response===undefined){
        // ele ta retornando sem resposta as vezes, mas no devtools aparece.
        // as vezes eh justamente por tar com o devtools aberto, checar dps
        console.log('No response')
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