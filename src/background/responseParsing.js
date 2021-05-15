  // parses network response body
  const parseBody =(response) => {
    if (chrome.runtime.lastError) {
        console.log('response error: ',chrome.runtime.lastError)
    }
    if(response===undefined){
        // ele ta retornando sem resposta as vezes, mas no devtools aparece.
        // as vezes eh justamente por tar com o devtools aberto, checar dps
        console.log('%cNo response','color:red')
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
        const membersInfo = data.data.node.new_members.edges.map(e=>e.node)

        const membersData = membersInfo.map(m=>{
            const{id,name,bio_text, url, __isProfile:type,is_verified} = m
            let bio = '--'
            if (bio_text?.text){
                bio = bio_text.text
            }
            const groupId = m.group_membership?.associated_group.id
            return new Member(id,name,bio,url,type,groupId,is_verified)
        })
        
        // add user data to storage
        insertMember(membersData)

        // console.log('getUsers: ',console.log(data.data.node))
    }

}
