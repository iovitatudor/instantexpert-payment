paypal.Buttons({
  // Order is created on the server and the order id is returned
  createOrder: (data, actions) => {
    const createdOrder = JSON.parse(localStorage.getItem('order'));
    console.log('lvfmdlmvdf');
    return fetch(`https://core.instantexpert.online/api/payments/order/${createdOrder.id}?lang=ro`, {
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
    const createdOrder = JSON.parse(localStorage.getItem('order'));
    return fetch(`https://core.instantexpert.online/api/payments/order/${data.orderID}/capture/${createdOrder.id}?lang=ro`, {
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
        // console.log(order);
        // window.location.href = `https://instantexpert.online/ro/callback/${order.expert.id}`;
        // Or go to another URL:  actions.redirect('thank_you.html');
      });
  }
}).render('#paypal-button-container');