document.addEventListener('DOMContentLoaded', function () {
    let currentTimePeriod = '';

    function updateClock() {
        const date = new Date();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        let timePeriod;

        if (hour >= 6 && hour <= 11) {
            timePeriod = "Good Morning.";
        } else if (hour >= 12 && hour <= 17) {
            timePeriod = "Good Afternoon.";
        } else {
            timePeriod = "Good Evening.";
        }

        const timeElement = document.getElementById("time");
        const infoElement = document.getElementById("info"); // Get the #info element

        const formattedTime = `${hour % 12 || 12}:${minutes.toString().padStart(2, '0')}${hour >= 12 ? 'pm' : 'am'}`;

        const formattedDate = `${date.getDate()}th of ${date.toLocaleString('default', { month: 'long' })}`;

        infoElement.innerHTML = `It's currently ${formattedTime}, ${formattedDate}.`;

        if (timePeriod !== currentTimePeriod) {
            timeElement.innerHTML = timePeriod;
            currentTimePeriod = timePeriod;
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    async function getRSSFeed() {
        try {
            let response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://news.google.com/rss?hl=en-AU&gl=AU&ceid=AU:en')}`);
            let data = await response.json();
            let parser = new DOMParser();
            let rssDocument = parser.parseFromString(data.contents, 'application/xml');
            let items = rssDocument.querySelectorAll('item');
            let topThreeArticles = [];
            for(let i = 0; i < Math.min(3, items.length); i++) { // Only get the first 3 items
                let item = items[i];
                let title = item.querySelector('title').textContent;
                let link = item.querySelector('link').textContent;
                topThreeArticles.push({title, link});
            }
            console.log(topThreeArticles);
        } catch (error) {
            console.error('Error getting RSS feed:', error);
        }
    }
    
    getRSSFeed();
});