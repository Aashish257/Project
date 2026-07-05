/*
Purpose: IP fetching, map embedding, and post office filtering.
Responsibility: Resolves IP info, sets map source, queries postal API, and implements lists filters.
Dependencies: index.html selectors.
Concepts Used: Fetch, Iframes, Timezone parsing, filters.
Learning Outcomes: Creating a composite app using multiple API resources.
*/

// STEP 1: Create selectors for buttons, map container, and search fields
let userIp = '';
let allPostOffices = [];
const infoTimezone = document.getElementById('info-timezone');
const infoPincode = document.getElementById('info-pincode');
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const ipDisplay = document.getElementById('ip-address-display');
const infoIp = document.getElementById('info-ip');
const infoLat = document.getElementById('info-lat');
const infoLon = document.getElementById('info-lon');
const infoCity = document.getElementById('info-city');
const infoRegion = document.getElementById('info-region');
const infoOrg = document.getElementById('info-org');
const infoHost = document.getElementById('info-host');
const infoDatetime = document.getElementById('info-datetime');
const infoMessage = document.getElementById('info-message');
const mapIframe = document.getElementById('map-iframe');
const searchInput = document.getElementById('search-input');
const postOfficesGrid = document.getElementById('post-offices-grid');
const apiKey = "3fd5d5629b43444fb8404567ef42117d";


// STEP 2: Fetch client IP on window load

window.addEventListener('load', () => {
    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
            userIp = data.ip;
            ipDisplay.textContent = userIp;
        })
        .catch(err => console.error('IP fetch error:', err));
});

// STEP 3: Request IP details on action trigger
function showScreen2() {
    screen1.classList.remove('active');
    screen2.classList.add('active');
    fetchDetails(userIp);
}


// STEP 4: Set iframe source using lat/lon coordinate markers
function fetchDetails(ip) {
    fetch(`https://ipinfo.io/${ip}/json`)
        .then(res => res.json())
        .then(data => {
            const [lat, lon] = data.loc.split(',');
            infoIp.textContent = ip;
            infoLat.textContent = lat;
            infoLon.textContent = lon;
            infoCity.textContent = data.city;
            infoRegion.textContent = data.region;
            infoTimezone.textContent = data.timezone;
            infoPincode.textContent = data.postal;
            infoOrg.textContent = data.org;
            infoHost.textContent = data.hostname || 'N/A';

            // Map
            mapIframe.src = `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;

            // Timezone clock
            startClock(data.timezone);

            // Postal branches
            fetchPostalBranches(data.postal);
        })
        .catch(err => console.error('Geo fetch error:', err));
}


// STEP 5: Calculate and display current time from timezone property
function startClock(timezone) {
    setInterval(() => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            dateStyle: 'full',
            timeStyle: 'long'
        });
        infoDatetime.textContent = formatter.format(now);
    }, 1000);
}

// STEP 6: Fetch post office branches using postal code
function fetchPostalBranches(pincode) {
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then(res => res.json())
        .then(data => {
            if (data[0].Status === 'Success') {
                allPostOffices = data[0].PostOffice || [];
                infoMessage.textContent = `Number of pincode(s) found: ${allPostOffices.length}`;
                renderCards(allPostOffices);
            } else {
                infoMessage.textContent = 'No post offices found';
            }
        })
        .catch(err => {
            infoMessage.textContent = 'Error fetching postal data';
            console.error(err);
        });
}

// STEP 7: Bind search field to filter post offices in real-time
function renderCards(list) {
    postOfficesGrid.innerHTML = list.map(po => `
    <div class="post-office-card">
      <p><strong>Name:</strong> ${po.Name}</p>
      <p><strong>Branch Type:</strong> ${po.BranchType}</p>
      <p><strong>Delivery Status:</strong> ${po.DeliveryStatus}</p>
      <p><strong>District:</strong> ${po.District}</p>
      <p><strong>Division:</strong> ${po.Division}</p>
    </div>
  `).join('');
}


searchInput.addEventListener('input', e => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = allPostOffices.filter(po => {
        const name = (po.Name || '').toLowerCase();
        const branchType = (po.BranchType || '').toLowerCase();
        return name.includes(query) || branchType.includes(query);
    });
    renderCards(filtered);
});
