document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('films');
    const apiEndpoint = 'http://localhost:3000/films'; // the endpoint from the json-server
    // const title = document.getElementById('title');
    


    fetch(apiEndpoint) // featch all the data from the API
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                const remainingTickets = item.capacity - item.tickets_sold;

                const li = document.createElement('li'); // create the movie item with the class
                li.classList.add("film", "list");
                li.setAttribute("id", item.id);
                if (remainingTickets === 0) li.classList.add("sold-out")
                // iterating all the movies in the array
                li.innerHTML = '<a href="javascript:getMovie('+item.id+')">' + item.title + '</a> : <a href="javascript:deleteMovie(' + item.id + ')" class="ui orange button"> Delete </a>';
                itemList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('There was a problem from the api:', error);
            const li = document.createElement('li');
            li.textContent = 'Problem loading items';
            itemList.appendChild(li);
        });

        getMovie(1);
});

function getMovie(movieId) {
    const apiEndpoint = 'http://localhost:3000/films/' + movieId;
    const poster = document.getElementById('poster');
    const runtime = document.getElementById('runtime');
    const title = document.getElementById('title');
    const filmInfo = document.getElementById('film-info');
    const showtime = document.getElementById('showtime');
    const ticketNum = document.getElementById('ticket-num');
    const buyTicket = document.getElementById('buy-ticket');    
    
    fetch(apiEndpoint) // featch all the data from the API
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const remainingTickets = data["capacity"] - data["tickets_sold"];
            title.textContent = data["title"] || JSON.stringify(data["title"]);
            runtime.textContent = data["runtime"] || JSON.stringify(data["runtime"] ) + "minutes";
            filmInfo.textContent = data["description"] || JSON.stringify(data["description"]);
            showtime.textContent = data["showtime"] || JSON.stringify(data["showtime"]);
            ticketNum.textContent = remainingTickets
            poster.src = data["poster"] || JSON.stringify(data["poster"]);

            if (remainingTickets === 0){
                buyTicket.textContent = "Sold Out";
            }
            else {
                buyTicket.textContent = "Buy Ticket";
                buyTicket.setAttribute("data_id", data["id"]);
                buyTicket.setAttribute("data_tickets", data["tickets_sold"])
            }
        })
        .catch(error => {
            console.error('There was a problem from the api:', error);
            const li = document.createElement('li');
            li.textContent = 'Problem loading items';
            itemList.appendChild(li);
        });

}

function updataMovie(movieId, tickets_sold){

    endpointUrl = 'http://localhost:3000/films/' + movieId
    tickets_sold = parseInt(tickets_sold)

    const requestBody = {
        tickets_sold: tickets_sold + 1
    };

    // define options and headers
    const fetchOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    };

    // Make the PATCH request
    return fetch(endpointUrl, fetchOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Patch successful:', data);
            document.getElementById('ticket-num').textContent = data["capacity"] - data["tickets_sold"]
        })
        .catch(error => {
            console.error('There was a problem with the patch operation:', error);
            throw error;
        });
}

function addTicket(movieId){

    endpointUrl = 'http://localhost:3000/tickets'

    const requestBody = {
        film_id: movieId,
        number_of_tickets: 1
    };

    // define options and headers
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    };

    // Make the PATCH request
    return fetch(endpointUrl, fetchOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Patch successful:', data);
        })
        .catch(error => {
            console.error('There was a problem with the patch operation:', error);
            throw error;
        });
}

function deleteMovie(movieId){

    const itemList = document.getElementById('films');
    endpointUrl = 'http://localhost:3000/films/' + movieId

    // define options and headers
    const fetchOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    // Make the PATCH request
    return fetch(endpointUrl, fetchOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            item = document.getElementById(movieId);
            item.remove()
        })
        .catch(error => {
            console.error('There was a problem with the patch operation:', error);
            throw error;
        });
}

$("#buy-ticket").click(function(){
    const id =document.getElementById("buy-ticket").getAttribute("data_id");
    const tickets_sold =document.getElementById("buy-ticket").getAttribute("data_tickets");

    updataMovie(id, tickets_sold);
    addTicket(id);
  });

$(".delete-btn").click(function(){
    alert("tell me")
    const id = $(this).data('id')
    console.log(id)
// deleteMovie(id)
});