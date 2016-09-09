import React, {Component} from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';

import axios from 'axios';
import NavBar from './navBar.jsx'

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // Client token provided by Braintree for testing purposes. In production,
    // a client token needs to be generated on the server side.
    var authorization = 'eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJhNDU5NzA1ODAwYTNkNTE4OWM2MWUwM2ZhZjU2ZTJiYjMzNTQ1M2I5ZmZjNjI0OWZlNDdlZDE0ZWY2ZTJhMTk4fGNyZWF0ZWRfYXQ9MjAxNi0wOS0wOVQwMjo1OTowNy40NTY1ODI0MDArMDAwMFx1MDAyNm1lcmNoYW50X2lkPTM0OHBrOWNnZjNiZ3l3MmJcdTAwMjZwdWJsaWNfa2V5PTJuMjQ3ZHY4OWJxOXZtcHIiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvMzQ4cGs5Y2dmM2JneXcyYi9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbXSwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzLzM0OHBrOWNnZjNiZ3l3MmIvY2xpZW50X2FwaSIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIiwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vY2xpZW50LWFuYWx5dGljcy5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tLzM0OHBrOWNnZjNiZ3l3MmIifSwidGhyZWVEU2VjdXJlRW5hYmxlZCI6dHJ1ZSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImRpc3BsYXlOYW1lIjoiQWNtZSBXaWRnZXRzLCBMdGQuIChTYW5kYm94KSIsImNsaWVudElkIjpudWxsLCJwcml2YWN5VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3BwIiwidXNlckFncmVlbWVudFVybCI6Imh0dHA6Ly9leGFtcGxlLmNvbS90b3MiLCJiYXNlVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhc3NldHNVcmwiOiJodHRwczovL2NoZWNrb3V0LnBheXBhbC5jb20iLCJkaXJlY3RCYXNlVXJsIjpudWxsLCJhbGxvd0h0dHAiOnRydWUsImVudmlyb25tZW50Tm9OZXR3b3JrIjp0cnVlLCJlbnZpcm9ubWVudCI6Im9mZmxpbmUiLCJ1bnZldHRlZE1lcmNoYW50IjpmYWxzZSwiYnJhaW50cmVlQ2xpZW50SWQiOiJtYXN0ZXJjbGllbnQzIiwiYmlsbGluZ0FncmVlbWVudHNFbmFibGVkIjp0cnVlLCJtZXJjaGFudEFjY291bnRJZCI6ImFjbWV3aWRnZXRzbHRkc2FuZGJveCIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9LCJjb2luYmFzZUVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoiMzQ4cGs5Y2dmM2JneXcyYiIsInZlbm1vIjoib2ZmIn0=';
    var form = document.querySelector('#checkout-form');
    var submit = document.querySelector('input[type="submit"]');

    braintree.client.create({
      authorization: authorization
    }, function (clientErr, clientInstance) {
      if (clientErr) {
        return;
      }

      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          'input': {
            'font-size': '14pt'
          },
          'input.invalid': {
            'color': 'red'
          },
          'input.valid': {
            'color': 'green'
          }
        },
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '4111 1111 1111 1111'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '123'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: '10 / 2019'
          }
        }
      }, function (hostedFieldsErr, hostedFieldsInstance) {
        if (hostedFieldsErr) {
          return;
        }

        submit.removeAttribute('disabled');

        form.addEventListener('submit', function(event) {
          event.preventDefault();

          hostedFieldsInstance.tokenize(function(tokenizeErr, payload) {
            if (tokenizeErr) {
              return;
            }

            // Puts an automatically generated nonce, a string returned by the
            // client SDK to represent a payment method, into the hidden
            // 'payment-method-nonce' input field, and submits the form. On submit,
            // a post request to the /checkout endpoint is made with the user's
            // payment details.
            document.querySelector('input[name="payment-method-nonce"]').value = payload.nonce;
            form.submit();
          });
        }, false);
      });
    });
  }

  render() {
    return (
      <div className="container">
        <NavBar />

        <form id="checkout-form" action="/checkout" method="post">
          <div id="error-message"></div>

          <label htmlFor="card-number">Card Number</label>
          <div className="hosted-field" id="card-number"></div>
          <div><img id="cards" src="../../cards.png"/></div>

          <label htmlFor="cvv">CVV</label>
          <div className="hosted-field" id="cvv"></div>

          <label htmlFor="expiration-date">Expiration Date</label>
          <div className="hosted-field" id="expiration-date"></div>

          <input type="hidden" name="payment-method-nonce" />
          <input className="submit-btn" type="submit" value="Submit Payment" disabled />
        </form>
      </div>
    )
  }
}

export default Payment;
