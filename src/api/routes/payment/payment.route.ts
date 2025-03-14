import express, { IRouter, NextFunction } from 'express'
import { appConfig } from '../../../config'

// This is your test secret API key.
const stripe = require('stripe')(
  'sk_test_51LSlY8GDFiXM20oc9zV7T4a3adJ9kf0mTv6RGEvFr3B5id1Yc9zpTAyMDvitzWrKVwEJVvK8nup9UOGQhby40lEO00ChKgSTZg'
)

/**
 * @group Payment Routes.
 * This are the stripe payment routes.
 */

/**
 * It takes a route, and returns a route that responds to a POST request to the path
 * `/consulting-price` with a list of prices from Stripe
 * @param {IRouter} route - IRouter - this is the Express Router object that we're using to create the
 * route.
 * @returns A function that takes a route as a parameter and returns a callback function that takes a request,
 * response, and next as parameters.
 */
export const consultingPrice = (route: IRouter): void => {
  route.post('/consulting-price', async (req, res, next) => {
    const prices = await stripe.prices.list({
      lookup_keys: [req.body.lookup_key],
      expand: ['data.product']
    })
    res.send({ prices })
  })
}

/**
 * We get all the subscriptions, we get the product we want to update, we create a new price, we update
 * the subscription with the new price
 * @param {IRouter} route - IRouter
 * @returns The subscription object
 */
export const updatePrice = (route: IRouter): void => {
  route.post('/update-price', async (req, res, next) => {
    const newPrice = 11111 // El precio debe ser enviado desde su backend
    const product = 'Cloumize' // El producto a actualizar debe ser enviado desde su backend

    // Miramos todas las subscripciones
    const subscriptions = await stripe.subscriptions.list({
      limit: 3
    })

    // Seleccionamos el producto sobre el que queremos modificar el precio
    const products = await stripe.products.list({
      limit: 3
    })
    const productChooosed = products.data.filter((p: any) => p.name === product)

    // Actualizamos el precio
    const price = await stripe.prices.create({
      unit_amount: newPrice,
      currency: 'usd',
      recurring: { interval: 'month' },
      product: productChooosed[0].id
    })

    const subscription = await stripe.subscriptions.retrieve(subscriptions.data[0].id)
    stripe.subscriptions.update(subscriptions.data[0].id, {
      cancel_at_period_end: false,
      proration_behavior: 'create_prorations',
      items: [
        {
          id: subscription.items.data[0].id,
          price: price.id
        }
      ]
    })
    res.send({ subscription })
  }) // Admin route
}

/**
 * It creates a checkout session for a given product
 * @param {IRouter} route - IRouter - This is the route object that we created in the previous step.
 * @returns A function that takes in a route and returns a route.
 */
export const createCheckoutSession = (route: IRouter): void => {
  route.post('/create-checkout-session', async (req, res, next) => {
    const prices = await stripe.prices.list({
      lookup_keys: [req.body.lookup_key],
      expand: ['data.product']
    })
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${appConfig.FRONT_URL}/user/account?success=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appConfig.FRONT_URL}/error`
    })
    res.send({ sessionURL: session.url })
  })
}

/**
 * It creates a billing portal session for a customer
 * @param {IRouter} route - IRouter
 * @returns The url to the billing portal.
 */
export const createPortalSession = (route: IRouter): void => {
  route.post('/create-portal-session', async (req: any, res, next: NextFunction) => {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    console.log('req.body', req.body)
    const { sessionId } = req.body
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)

    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = appConfig.FRONT_URL

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer,
      return_url: returnUrl
    })
    console.log('portalSession', portalSession)

    res.send({ portalSession: portalSession.url })
  })
}

/**
 * It receives a Stripe webhook event, verifies the event's signature, and then logs the event's type
 * and status
 * @param {IRouter} route - IRouter
 * @returns A function that takes a route and returns a function that takes a request and response.
 */
export const webhook = (route: IRouter): void => {
  route.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    let event = request.body
    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    const endpointSecret = 'whsec_12345'
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers['stripe-signature']
      try {
        event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret)
      } catch (err) {
        console.log('⚠️  Webhook signature verification failed.', err.message)
        return response.sendStatus(400)
      }
    }
    let subscription
    let status
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        subscription = event.data.object
        status = subscription.status
        console.log(`Subscription status is ${status}.`)
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break
      case 'customer.subscription.deleted':
        subscription = event.data.object
        status = subscription.status
        console.log(`Subscription status is ${status}.`)
        // Then define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break
      case 'customer.subscription.created':
        subscription = event.data.object
        status = subscription.status
        console.log(`Subscription status is ${status}.`)
        // Then define and call a method to handle the subscription created.
        // handleSubscriptionCreated(subscription);
        break
      case 'customer.subscription.updated':
        subscription = event.data.object
        status = subscription.status
        console.log(`Subscription status is ${status}.`)
        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`)
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send()
  })
}
