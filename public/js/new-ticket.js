const currentTicketLabel = document.querySelector('span');
const createTicketButton = document.querySelector('button');

async function getLastTicket() {
    const lastTicket = await fetch('/api/ticket/last').then(resp => resp.json());
    currentTicketLabel.innerText = lastTicket;
}

async function createTicket() {
    const newTicket = await fetch('/api/ticket', {
        method: 'POST'
    }).then(resp => resp.json());

    currentTicketLabel.innerText = newTicket.number;
}

createTicketButton.addEventListener('click', createTicket)
getLastTicket();