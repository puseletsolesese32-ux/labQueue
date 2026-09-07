
const ticketForm = document.getElementById('ticket-form');
const queueList = document.getElementById('queue-list');
const ticketCountBadge = document.getElementById('ticket-count');

let tickets = JSON.parse(localStorage.getItem('labQueueTickets')) || [];

function saveTickets() {
  localStorage.setItem('labQueueTickets', JSON.stringify(tickets));
}

function updateBadge() {
  const openCount = tickets.filter(t => !t.claimed).length;
  ticketCountBadge.textContent = `${openCount} Open`;
}

function renderQueue() {
  queueList.innerHTML = '';

  if (tickets.length === 0) {
    queueList.innerHTML = `<p class="empty-msg">No open tickets right now</p>`;
    updateBadge();
    return;
  }

  tickets.forEach((ticket) => {
    const ticketCard = document.createElement('div');
    ticketCard.className = `ticket-item ${ticket.claimed ? 'claimed' : ''}`;

    ticketCard.innerHTML = `
      <div class="ticket-top">
        <div class="student-info">
          <h3>${escapeHTML(ticket.name)}</h3>
          <span> ${escapeHTML(ticket.location)}</span>
        </div>
        <span class="topic-tag">${escapeHTML(ticket.topic)}</span>
      </div>
      
      <p class="problem-text">${escapeHTML(ticket.problem)}</p>
      
      <div class="ticket-actions">
        ${
          ticket.claimed
            ? `<button class="btn-action btn-resolve" onclick="resolveTicket(${ticket.id})">Mark Resolved</button>`
            : `<button class="btn-action btn-claim" onclick="claimTicket(${ticket.id})">Claim Ticket</button>`
        }
        <button class="btn-action btn-resolve" onclick="deleteTicket(${ticket.id})">Delete</button>
      </div>
    `;

    queueList.appendChild(ticketCard);
  });

  updateBadge();
}

ticketForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.getElementById('student-name');
  const topicInput = document.getElementById('topic');
  const locationInput = document.getElementById('desk-location');
  const problemInput = document.getElementById('problem-desc');

  const newTicket = {
    id: Date.now(),
    name: nameInput.value.trim(),
    topic: topicInput.value,
    location: locationInput.value.trim(),
    problem: problemInput.value.trim(),
    claimed: false
  };

  tickets.push(newTicket);
  saveTickets();
  renderQueue();

  ticketForm.reset();
});

function claimTicket(id) {
  tickets = tickets.map(ticket => {
    if (ticket.id === id) {
      return { ...ticket, claimed: true };
    }
    return ticket;
  });
  saveTickets();
  renderQueue();
}

function resolveTicket(id) {
  deleteTicket(id);
}

function deleteTicket(id) {
  tickets = tickets.filter(ticket => ticket.id !== id);
  saveTickets();
  renderQueue();
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

renderQueue();