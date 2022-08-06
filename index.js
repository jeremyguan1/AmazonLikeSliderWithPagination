(async function() {
    let currentTracker = 0;
    const maxDisplay = 10
    const booksRequest = new newBookRequest(1)
    let books = await booksRequest()
    updateTheDom()
    registerFunctionButton()

    function newBookRequest(page) {
        this.currentPage = page;
        this.query = 'The lord of ring';
  
        const getBooks = async () => {
            this.currentPage++
            return await fetch('http://openlibrary.org/search.json?'+ new URLSearchParams({q: this.query, page: this.currentPage}))
                .then(data => data.json())
                .then(data => {
                    return data.docs
                })
        }
        return getBooks
    }

    function updateTheDomLoading() {
        const carousel = document.querySelectorAll('.product-items-item')
        carousel.forEach(node => {
            node.innerHTML = `
                <div class="fa-3x" style="    display: flex; align-items:center; justify-content: center;
                white-space: normal;">
                <i class="fa-solid fa-spinner fa-spin"></i>
                </div>
            `
        })
    }


    function updateTheDom() {
        const carousel = document.querySelectorAll('.product-items-item')
        carousel.forEach((node, idx) => {
            if(books[currentTracker + idx]) {
                node.innerHTML = `
                    <div style="    display: flex;
                    white-space: normal;">
                    ${books[currentTracker + idx].title}
                    </div>
                `
            }else {
                node.innerText = ""
            }
        })
    }

    function registerFunctionButton() {
        const nextBtn = document.querySelector('.nxt-btn')
        nextBtn.addEventListener('click', async () => {
            currentTracker += maxDisplay
            if(currentTracker >= books.length) {
                updateTheDomLoading()
                let currBook = await booksRequest()
                if(currBook.length === 0) {
                    currentTracker -= maxDisplay
                    updateTheDom()
                    return
                }
                books = [...books, ...currBook]
                updateTheDom()
            }else {
                updateTheDom()
            }
        })

        const prevBtn = document.querySelector('.prv-btn')
        prevBtn.addEventListener('click', () => {
            if(currentTracker === 0) {
                return
            }
            currentTracker -= maxDisplay
            updateTheDom()
        })
    }
})()