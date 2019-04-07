<template>
  <div id="wrapper" :class="{ 'theme-dark': darkMode }">
    <b-container fluid class="">
      <div class="row">
        <div class="col-md-9 text-left order-2 px-0"
          @mouseover="hoveringVideo = true"
          @mouseleave="hoveringVideo = false"
        >
          <div class="embed-responsive embed-responsive-16by9 p-relative">
            <video class="embed-responsive-item " width="720" height="480" id="video" autoplay :controls="hoveringVideo ? 'controls' : false"></video>
              <div class="spinner-container text-center d-flex justify-content-center align-items-center" v-if="loadingState != 'loaded'">
              <b-spinner variant="light" type="grow"></b-spinner>
            </div>
          </div>
          <!-- <div class="card bg-gray py-3" v-if="currentChannel.name">
            <img :src="channels[currentChannel.name].logo.url" v-if="channels[currentChannel.name].logo.url" height="35">
            <h2 class="text-primary" v-if="!channels[currentChannel.name].logo">{{ currentChannel.name }}</h2>
          </div> -->
        </div>
        <div class="col-md-3 order-1 px-0 pt-4 border-right border-dark text-left">
          <h1 class="text-light font-weight-800 letter-spacing-1 text-left pl-3 pt-1">Newswire</h1>
          <b-list-group class="pt-1">
            <b-list-group-item button v-for="(options, channel) in channels" :key="channel.id" v-on:click="changeChannel(channel)" class="py-3 pl-3">
              <img :src="options.logo.url" v-if="options.logo.url" :height="options.logo.height">
              <span class="label" v-if="!options.logo.url">{{channel}}</span>
            </b-list-group-item>
          </b-list-group>
          <div class="pt-3 pl-3">
            <b-button v-b-modal.modal-1 size="sm" variant="outline-gray" class="mt-1"><img src="static/icons/settings.svg" height="24"></b-button>
          </div>
        </div>
      </div>
      <!-- Modal Component -->
      <b-modal id="modal-1" title="About"
        size="lg"
        header-bg-variant="gray"
        body-bg-variant="gray"
        footer-bg-variant="gray"
        centered
      >
        <a href="#" v-on:click="open('https://pixelglitch.net')">pixel glitch llc</a>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
  import ChannelList from '@/components/ChannelList'
  import Hls from 'hls.js'

  const rp = require('request-promise')
  const { systemPreferences } = require('electron')

  // const c = require('cheerio')

  export default {
    name: 'dashboard',
    components: { ChannelList },
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
        },
        hoveringVideo: false
      }
    },
    mounted () {
      // let self = this
      this.changeChannel(this.currentChannel.name)
      console.log('SystemPref: ' + systemPreferences)
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
        this.loadingState = 'loading'
        console.log(this.loadingState)
        console.log('Changing to: ' + channel)
        let url = this.getChannelUrl(channel)
        this.getStream(url)
      },
      getChannelUrl (channel) {
        console.log('Getting channel url')
        this.currentChannel.url = this.channels[channel].url
        this.currentChannel.name = channel
        return this.channels[channel].url
      },
      getStream (url) {
        let self = this
        console.log('Scraping url: ' + url)
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
            console.log('Opened stream: ' + url)
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              // console.log('manifest loaded, found ' + data.levels.length + ' quality level')
              video.play()
              self.loadingState = 'loaded'
              console.log('loaded')
            })
          })
        }
      }
    }
  }
</script>
