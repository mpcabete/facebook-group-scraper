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
      // employerPossibleEmails:[]
      console.log('data',data)
  })
}