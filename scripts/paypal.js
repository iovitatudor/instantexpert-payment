paypal.Buttons({
  // Order is created on the server and the order id is returned
  createOrder: (data, actions) => {
    const createdOrder = JSON.parse(localStorage.getItem('order'));
    return fetch(`http://127.0.0.1:5000/api/payments/order/${createdOrder.id}?lang=ro`, {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Basic ${basicToken}`,
      }
      // use the "body" param to optionally pass additional order information
      // like product skus and quantities
    })
      .then((response) => response.json())
      .then((order) => order.id);
  },
  // Finalize the transaction on the server after payer approval
  onApprove: (data, actions) => {
    return fetch(`http://127.0.0.1:5000/api/payments/order/${data.orderID}/capture?lang=ro`, {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Basic ${basicToken}`,
      }
    })
      .then((response) => response.json())
      .then((orderData) => {
        // Successful capture! For dev/demo purposes:
        console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
        const transaction = orderData.purchase_units[0].payments.captures[0];
        // alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
        // When ready to go live, remove the alert and show a success message within this page. For example:
        const element = document.getElementById('paypal-button-container');
        element.innerHTML = '<h3>Thank you for your payment!</h3>';
        const order = JSON.parse(localStorage.getItem('order'));
        window.location.href = `http://localhost:3021/ro/callback/${order.expert_id}`;
        // Or go to another URL:  actions.redirect('thank_you.html');
      });
  }
}).render('#paypal-button-container');