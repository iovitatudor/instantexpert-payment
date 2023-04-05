const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get('token')
// const backendUrl = 'http://127.0.0.1:5000/api';
// const basicToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSW5zdGFudGV4cGVydCIsInVybCI6Imh0dHBzOi8vaW5zdGFudGV4cGVydC5vbmxpbmUvIiwidW5pcXVlSWQiOjE0NDIwNzcyNjE4OSwiaWF0IjoxNjc1NzAwNzcxLCJleHAiOjE2NzU3ODcxNzF9.zFu7t-3xeVH5iWAK02BKG2tiX65TmDXcf3qMHlqWLAo';
const backendUrl = 'https://core.instantexpert.online/api';
const basicToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSW5zdGFudGV4cGVydCIsInVybCI6Imh0dHBzOi8vaW5zdGFudGV4cGVydC5vbmxpbmUvIiwidW5pcXVlSWQiOjgxMjczNDUzODQyNCwiaWF0IjoxNjc4ODc2NzgwLCJleHAiOjE2Nzg5NjMxODB9.6nvMpMRB_QsaHuGSePWj7EU4KDcRSRki2xkGT7IDFU8';


async function findOrderByToken(token) {
  const response = await fetch(`${backendUrl}/order/token/${token}?lang=ro`,
    {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Basic ${basicToken}`,
      }
    },
  );
  return await response.json();
}

async function updateOrder(id, body) {
  const response = await fetch(`${backendUrl}/order/${id}?lang=ro`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Basic ${basicToken}`,
    }
  });
  return await response.json();
}

findOrderByToken(token).then(order => {
  localStorage.setItem('order', JSON.stringify(order));
  const orderExpertNameEl = document.querySelector('#order-expert-name');
  const orderDateEl = document.querySelector('#order-date');
  const orderTimeEl = document.querySelector('#order-time');
  const orderAmountEl = document.querySelector('#order-amount');
  const orderTypeEl = document.querySelector('#order-type');
  const paymentAreaEl = document.querySelector('#payment-area');
  orderExpertNameEl.innerHTML = order.expert.name;
  orderDateEl.innerHTML = order.date;
  orderTimeEl.innerHTML = order.time;
  orderAmountEl.innerHTML = order.amount;
  orderTypeEl.innerHTML = order.type;
  paymentAreaEl.classList.remove('hidden');
});

function cancelPayment() {
  const body = {
    status: 'cancelled',
  };

  const order = JSON.parse(localStorage.getItem('order'));

  updateOrder(order.id, body).then(order => {
    localStorage.setItem('order', JSON.stringify(order));
    window.location.href = document.referrer;
  });
}
