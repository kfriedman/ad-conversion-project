'use strict'
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()
const router = express.Router()

const cookieParser = require('cookie-parser')
const uuidv1 = require('uuid/v1')
const config = require('./config/config.js')

app.set('view engine', 'ejs')
app.use(cookieParser())

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))
router.use(awsServerlessExpressMiddleware.eventContext())

// NOTE: tests can't find the views directory without this
app.set('views', path.join(__dirname, 'views'))

const cache = {}

router.get('/js/ads.js', (req, res) => {
  res
    .status(200)
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .header('Content-Type', 'application/javascript')
    .header('Cache-Control', 'max-age=7200')
    .sendFile(__dirname + '/js/ads.js')
})

router.get('/', (req, res) => {
  res
    .status(200)
    .render('index', {})
})

router.get('/advertiser', (req, res) => {
  res
    .status(200)
    .render('advertiser', {})
})

router.get('/advertiser_convert/:adId', (req, res) => {
  res
    .status(200)
    .render('advertiser_convert', {})
})

router.get('/advertisers/:advertiserId/ads', (req, res) => {
})

router.get('/advertisers/:advertiserId/history', (req, res) => {
  let adHistory = null

  if (req.cookies.adsViewed) {
    adHistory = JSON.parse(req.cookies.adsViewed)

    for (const adId in adHistory) {
      let cacheKey = adId + '-' + req.cookies.clientId

      adHistory[adId]['converted'] = false

      if (cache[cacheKey]) {
        adHistory[adId]['converted'] = true
      }
    }
  }

  res
    .status(200)
    .json({
      'adHistory': adHistory
    })
})

router.get('/publishers/:publisherId/ads', (req, res) => {
  /**
   * @param {string} adsViewedCookie
   * @param {number} adId
   * @param {number} publisherId
   * @return {string}
   */
  function addAdView (adsViewedCookie, adId, publisherId) {
    let adsViewed = {}

    if (adsViewedCookie) {
      adsViewed = JSON.parse(adsViewedCookie)
    }

    if (adsViewed[adId] && adsViewed[adId]['publishers'] && adsViewed[adId]['publishers'][publisherId]) {
      adsViewed[adId]['publishers'][publisherId]++

      return JSON.stringify(adsViewed)
    }

    let ad = {}
    ad[adId] = {}
    ad[adId]['publishers'] = {}
    ad[adId]['publishers'][publisherId] = 1

    adsViewed = Object.assign(adsViewed, ad)

    return JSON.stringify(adsViewed)
  }

  let adId = Math.floor(Math.random() * Math.floor(10000))

  let tracking = {
    adId: adId,
    clientId: req.cookies.clientId || uuidv1(),
    adsViewed: addAdView(req.cookies.adsViewed, adId, parseInt(req.params.publisherId))
  }

  res
    .status(200)
    .cookie('clientId', tracking.clientId, config.defaultCookieOptions)
    .cookie('adsViewed', tracking.adsViewed)
    .json({
      'adId': tracking.adId,
      'adHtml': `<div class="card" style="width: 18rem;">` +
        `<div class="card-body">` +
        `<h5 class="card-title">Sample Ad</h5>` +
        `<p class="card-text">You were just shown Ad #${tracking.adId}</p>` +
        `<a href="/development/advertiser" class="btn btn-primary">Visit Advertiser</a>` +
        `</div>`
    })
})

router.post('/conversions', (req, res) => {
  let cacheKey = req.body.adId + '-' + req.cookies.clientId

  if (cache[cacheKey]) {
    res
      .status(200)
      .json(Object.assign({newConversion: false}, req.body))

    return false
  }

  cache[cacheKey] = true

  res
    .status(201)
    .json(Object.assign({newConversion: true}, req.body))

  return false
})

// The aws-serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router)

// Export your express server so you can import it in the lambda function.
module.exports = app
