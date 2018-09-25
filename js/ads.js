let ads = {
  publisherId: null,
  advertiserId: null,

  baseAdApi: '/development',

  initialize: function () {
  },

  recordAdvertiserConversion: function (divId, adId, conversionValue) {
    $(document).ready(function () {
      $.post(ads.baseAdApi + '/conversions', {adId: adId, conversionValue: conversionValue}, function (result) {
        let div = $('#' + divId)

        if (result.newConversion) {
          div.html('<div class="alert alert-success" role="alert">New conversion recorded (' + result.adId + ')</div>')
          return true
        }

        div.html('<div class="alert alert-warning" role="alert">Conversion has already been recorded (' + result.adId + ')</div>')
        return false
      })
    })
  },

  createPublisher: function (publisherId, visitorId) {
    this.publisherId = publisherId
  },

  createAdvertiser: function (advertiserId) {
    this.advertiserId = advertiserId
  },

  showAdvertiserHistory: function (divId) {
    $(document).ready(function () {
      $.get(ads.baseAdApi + '/advertisers/' + ads.advertiserId + '/history', {}, function (response) {
        let div = $('#' + divId)

        if (!response.adHistory) {
          div.append('<p><strong>No ads have been displayed yet</strong></p>')
          return false
        }

        for (const adId in response.adHistory) {
          div.append('<p><a href="/development/advertiser_convert/' + adId + '" class="btn btn-' + (response.adHistory[adId]['converted'] ? 'success' : 'primary') + '" role="button">Conversion for Ad #' + adId + '</a></p>')
        }
        return true
      })
    })
  },

  showAd: function (divId) {
    $(document).ready(function () {
      $.get(ads.baseAdApi + '/publishers/' + ads.publisherId + '/ads', {}, function (ad) {
        $('#' + divId).html(ad.adHtml)
      })
    })
  },
}

ads.initialize()
