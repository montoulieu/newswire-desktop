<template>
  <div id="wrapper" :class="{ 'theme-dark': darkMode }">
    <b-container fluid class="">
      <div class="row">
        <video-pane
          :channels="channels"
          :loadingState="loadingState"
          :currentStream="currentStream"
          :currentChannel="currentChannel"
        />
        <sidebar :channels="channels" @change-channel="changeChannel"/>
      </div>
    </b-container>
  </div>
</template>

<script>
  import Sidebar from '@/components/Sidebar'
  import VideoPane from '@/components/VideoPane'

  import Hls from 'hls.js'

  const rp = require('request-promise')
  // const { systemPreferences } = require('electron')

  // const c = require('cheerio')

  export default {
    name: 'dashboard',
    components: {
      VideoPane,
      Sidebar
    },
    data () {
      return {
        loadingState: '',
        currentChannel: {
          name: 'MSNBC',
          url: 'https://www.watchnews.pro/msnbc-news.html'
        },
        currentStream: '',
        channels: {
          'MSNBC': {
            url: 'https://www.watchnews.pro/msnbc-news.html',
            logo: {
              url: 'static/svg/logo/msnbc.svg',
              height: 22
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
    },
    mounted () {
      // let self = this
      this.changeChannel(this.currentChannel.name)
      // console.log('SystemPref: ' + systemPreferences)
    },
    computed: {
      darkMode: function () {

      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      changeChannel (channel) {
        console.log('------------------------------------------------------------------------------------------------------------')
        console.log('> Changing to: ' + channel)
        let url = this.getChannelUrl(channel)
        this.loadingState = 'loading'
        console.log('> Loading')
        this.getStream(url)
      },
      getChannelUrl (channel) {
        console.log('> Getting channel URL')
        this.currentChannel.url = this.channels[channel].url
        this.currentChannel.name = channel
        return this.channels[channel].url
      },
      getStream (url) {
        let self = this
        console.log('> Scraping url: ' + url)
        let options = {
          uri: encodeURI(url)
        }
        rp(options)
          .then(function (html) {
            // success
            // console.log(html)
            // let streamData = c('#myElement', html).next()[0].children[0].children[0].data

            let scrapedUrl = html.substring(
              html.lastIndexOf('file: "') + 7,
              html.lastIndexOf('",auto')
            )

            if (scrapedUrl) {
              self.currentStream = scrapedUrl
              self.openStream(scrapedUrl)
            }
          })
          .catch(function (err) {
            // error
            console.log(err)
          })
      },
      openStream (url) {
        let self = this
        if (Hls.isSupported()) {
          let video = document.getElementById('video')
          let hls = new Hls({
            // debug: true
          })
          hls.attachMedia(video)
          hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            // console.log('video and hls.js are now bound together !')
            hls.loadSource(url)
            console.log('> Opened stream: ' + url)
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              // console.log('manifest loaded, found ' + data.levels.length + ' quality level')
              video.play()
              self.loadingState = 'loaded'
              console.log('> Loaded')
              console.log('------------------------------------------------------------------------------------------------------------')
              console.log('')
            })
          })
        }
      }
    }
  }
</script>
