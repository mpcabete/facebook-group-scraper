Ja feito:
## members page scraping
- analysis of network requests in the facebook group member's page
- extension icon click event handler
- extension capturing network requests funsionality
- network request filering
- network response parsing
- member information extraction
- [x] finish analysis on click
- [x] remove duplicates
- [] group class to store the data
- [x] debugger detach
- [x] add data to local storage
- [x] clear data option
- [] trubleshoot empty response bug

## user page scraping
[x] network request analysis
[x] userClass to store data
[] recursive analysis of page's text nodes
[x] DOM mutation event listener
[x] email matching regex
[x] user company data extraction
[x] add data to previous user data

## company page scraping

## UI
- components:
  - Start buttons
    - members
    - group
    - companies
    - stop
  - data overview
    - n members
    - n analized members (%)
    - n companies
    - n analized companies 

- [x] stored data overview
- [] analysis time option
- [x] group analysis start button
- [x] userlist analysis start button
- [x] download button

## google spreadsheet generation

// botar input com seleçao do tempo e previsao de n de usuarios


## analise
empresas:
"LIFE_EVENTS" no graphql

https://www.facebook.com/kmschremser/about?section=year-overviews

links:
rout definition

structure: 
document.querySelectorAll('ul')[1].querySelectorAll('a')

