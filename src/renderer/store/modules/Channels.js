const state = {
  channels: {
    'ABC News': {
      url: 'https://www.watchnews.pro/abc-news.html',
      logo: {
        url: 'static/svg/logo/abc-news.svg',
        height: 26
      },
      favorite: false
    },
    'CBS News': {
      url: 'https://www.watchnews.pro/cbsn.html',
      logo: {
        url: 'static/svg/logo/cbs-news.svg',
        height: 24
      },
      favorite: false
    },
    'CNN': {
      url: 'https://www.watchnews.pro/cnn-news.html',
      logo: {
        url: 'static/svg/logo/cnn.svg',
        height: 26
      },
      favorite: false
    },
    'MSNBC': {
      url: 'https://www.watchnews.pro/msnbc-news.html',
      logo: {
        url: 'static/svg/logo/msnbc.svg',
        height: 22
      },
      favorite: false
    },
    'Al Jazeera America': {
      url: 'https://www.livenewsnow.com/american/al-jazeera-america.html',
      logo: {
        url: 'static/svg/logo/aljazeera.svg',
        height: 30
      },
      favorite: false
    },
    'Bloomberg': {
      url: 'https://www.watchnews.pro/bloomberg.html',
      logo: {
        url: 'static/svg/logo/bloomberg.svg',
        height: 22
      },
      favorite: false
    },
    'The Weather Channel': {
      url: 'https://www.watchnews.pro/the-weather-channel.html',
      logo: {
        url: 'static/svg/logo/weather-channel.svg',
        height: 35
      },
      favorite: false
    }

    // These streams give 403 errors 🤔
    // 'CNBC': {
    //   url: 'https://www.watchnews.pro/cnbc.html',
    //   logo: '',
    //   favorite: false
    // },
    // 'Fox News': {
    //   url: 'https://www.watchnews.pro/fox-news.html',
    //   favorited: false
    // },
    // 'HLN': {
    //   url: 'https://www.watchnews.pro/hln.html',
    //   logo: 'static/svg/logo/weather-channel.svg',
    //   favorite: false
    // },
  }
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}
