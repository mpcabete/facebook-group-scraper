class Line{

  constructor(firstName,lastName, profileURL, possibleEmployers ){
    this.firstName = firstName
    this.lastName = lastName 
    this.profileURL = profileURL
    this.possibleEmployers = possibleEmployers
  }

}

Line.prototype.updateEmployers = function(companiesData){
  this.possibleEmployers?.forEach(employer=>{
    const data = companiesData.find( company => { 
      return company.url === employer.employerFBPageUrl
    })
    employer.emails = data?.data?.emails ?? null
    employer.domains = data?.data?.domains ?? null
    
  })
}


Line.prototype.csv= function(){
 
  return parseNjoinLine(this)

  function parseNjoinLine(obj,f){
    itens = [
      obj["firstName"],
      obj["lastName"],
      obj["profileURL"],
      obj["possibleEmployers"],
    ];
    return itens.map(parse).join(",");
    // const keys = Object.keys(obj)
    // console.log('keys',keys)
    // keys.map(i=>f(i)).join(',')
    function parse(item) {
      const result = '"' + String(item).replace(/"/g, '""') + '"';
      // console.log('result',result)
      return result;
    }
}

  
}
