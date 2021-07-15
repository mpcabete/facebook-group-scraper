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
  console.log('this',Object.keys(this))
}
