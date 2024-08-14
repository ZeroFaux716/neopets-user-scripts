// ==UserScript==
// @name    Seamless Shop Browsing
// @author  ZeroFaux716
// @description Seamlessly loads the next page of items when you scroll down
// @version 0.0.0.7
// @match   *://www.neopets.com/browseshop.phtml?*
// @grant   none
// ==/UserScript==

var nextPageLink = Array.from(document.querySelectorAll('a')).filter(a => a.textContent.includes('Next 80 Items'));
nextPageLink[0].textContent = "";
nextPageLink[1].textContent = "";
let loadingNextPage = false;

function loadNextItems(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newItems = doc.querySelectorAll('td[width="120"]');

            const originalTable = document.querySelector('table[align="center"][border="0"][cellpadding="3"]');
            const tbody = originalTable.querySelector('tbody');
            let row = document.createElement('tr');

            newItems.forEach((item, index) => {
                const cell = document.createElement('td');
                cell.appendChild(item.cloneNode(true));
                row.appendChild(cell);

                if ((index + 1) % 5 === 0) {
                    tbody.appendChild(row);
                    row = document.createElement('tr');
                }
            });

            if (row.children.length > 0) {
                tbody.appendChild(row);
            }

            nextPageLink = Array.from(doc.querySelectorAll('a')).filter(a => a.textContent.includes('Next 80 Items'));
        })
        .catch(error => console.error('error loading page:', error))
        .finally(() => {
	    if (nextPageLink.length){
	        loadingNextPage = false;
            }
        });
}

function loadNextPageIfScrollPercentageReached(scrollPercentage) {
    const scrollPosition = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    if ((scrollPosition / scrollHeight) >= scrollPercentage && !loadingNextPage) {
        loadingNextPage = true;
        loadNextItems(nextPageLink);
    }
}

window.addEventListener('scroll', () => loadNextPageIfScrollPercentageReached(0.8));
