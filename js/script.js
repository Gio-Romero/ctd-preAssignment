
// creating stars for the web page
let counts = 0
setInterval(() => {
    if (counts !== 300) {
        counts++
        let dots = document.createElement('p')
        dots.textContent = '.'
        dots.style.color = 'white'
        dots.style.position = 'absolute'
        dots.style.top = `${Math.floor(Math.random() * 3000)}px`
        dots.style.right = `${Math.floor(Math.random() * 3000)}px`
        dots.style.width = '5px'
        dots.style.height = '5px'
        document.querySelector('body').append(dots)
    }
}, 5)

// creating size animation for the title
let count = 0
let headerTitle = document.querySelector('.title')
setInterval(() => {
    if (count !== 50) {
        count++
        headerTitle.style.fontSize = `${count}px`
    }
}, 25)


// API links
const urls = {
    base: 'https://swapi.dev/api/',
    people: 'people/',
    planets: 'planets/',
    films: 'films/',
    species: 'species/',
    vehicles: 'vehicles/',
    starships: 'starships/'
}


createLinks()
// creates nav links
function createLinks() {

    for (const url in urls) {
        const link = document.createElement('a')
        if (url !== 'base') {
            link.setAttribute('data-link', `${urls['base']}${urls[url]}`)
            link.setAttribute('class', 'mx-4 navItems')
            link.setAttribute('href', '')
            link.textContent = `${url}`

            // add an eventListener to each link to pass its url
            link.addEventListener('click', addLink)
            document.querySelector('nav').append(link)
        }
    }
}


// on clicking a link, retrieves the data and sends it to showResults function
function addLink(e) {
    e.preventDefault()
    //  show loading cursor
    const body = document.querySelector('body')
    body.setAttribute('class', 'cursorChange')

    fetch(`${e.target.dataset.link}`)
        .then(res => res.json())
        .then(data => showResults(data))
        .catch(err => alert('The requested information is not available at this time.Please try again later.'))
}

// posts the data received from API to the browser
function showResults(data) {

    // remove loading cursor
    const body = document.querySelector('body')
    body.removeAttribute('class', 'cursorChange')

    // create variable to hold the datas name for all except title
    let dataName
    let currentFooter = document.querySelector('footer')
    if (data.count !== 6) {
        dataName = data.next.split('/')[data.next.split('/').length - 2]
    }

    // remove and create the main element as new information comes in,
    // in order to replace the old
    let currentMain = document.querySelector('main')
    if (currentMain.children.length > 0) {
        currentMain.remove()
        const main = document.createElement('main')
        const header = document.querySelector('header')
        header.appendChild(main)
        currentMain = document.querySelector('main')
        currentMain.setAttribute('class', 'mt-5 text-center')
    }

    // removes and creates the footer element as new information comes in,
    // in order to replace the old
    if (currentFooter.children.length > 0) {
        currentFooter.remove()
        const footer = document.createElement('footer')
        const header = document.querySelector('header')
        header.append(footer)
        currentFooter = document.querySelector('footer')
        currentFooter.setAttribute('class', 'd-flex justify-content-around mt-5')
    }

    // loop over data results and depending on if its name or title, post 
    // the results to the main page
    for (const i in data.results) {

        let { name } = data.results[i]
        let { title } = data.results[i]
        if (name) {
            currentMain.innerHTML += `<p>Name: <a href="" data-link='https://www.swapi.tech/api/${dataName}/?name=${name}' class='allData'>${name}</a></p>`
        } else if (title) {
            currentMain.innerHTML += `<p>Title: <a href="" data-link='https://www.swapi.tech/api/films/' class='allData'>${title}</a></p>`
        }
    }

    // loop over the newly posted links, add a click event to each one
    for (const data of document.querySelectorAll('.allData')) {
        data.addEventListener('click', (e) => {
            e.preventDefault()
            // if the link is clicked then send the link data to the retrieveDetails function
            retrieveDetails(e)
        })
    }


    // add the previous link if applicable
    if (data.previous) {
        console.log(data)
        let prev = document.createElement('a')
        prev.setAttribute('href', '')
        prev.setAttribute('data-link', `${data.previous}`)
        prev.textContent = '<< Prev'
        prev.addEventListener('click', addLink)
        currentFooter.append(prev)
    }

    // add the next link if applicable
    if (data.next) {
        let next = document.createElement('a')
        next.setAttribute('href', '')
        next.setAttribute('data-link', `${data.next}`)
        next.textContent = 'Next >>'
        next.addEventListener('click', addLink)
        currentFooter.append(next)
    }
    // body.removeAttribute('class','cursorChange')

}

// fetches the elements link and sends the data to the showDetails function
function retrieveDetails(e) {
    fetch(`${e.target.dataset.link}`)
        .then(res => res.json())
        .then(data => showDetails(data))
        .catch(err => console.error(err))
}

// posts the keys and values of each link to the main element on the browser
function showDetails(data) {
    let main = document.querySelector('main')
    main.innerHTML = ''

    // loops over the properties and posts them to the main element
    for (let [k, v] of Object.entries(data.result[0].properties)) {
        if (k === 'name' || k === 'title') {
            const header = document.createElement('h2')
            header.textContent = `${v}`
            header.setAttribute('class', 'text-center text-primary')
            main.prepend(header)
        } else if (!Array.isArray(v) && !v.includes('https')) {
            main.innerHTML += `<p>${k}: ${v}</p>`
        }
    }
}





