<template>
  <div>
    <b-list-group class="pt-1">
      <b-list-group-item
        button
        v-for="(options, channel) in channels"
        :key="channel.id"
        v-on:click="changeChannel(channel)"
        v-bind:class="{ active: channel == currentChannel.name }"
        class="py-0 pl-4"
      >
        <img :src="options.logo.url" v-if="options.logo.url" :height="options.logo.height">
        <span class="label" v-if="!options.logo.url">{{channel}}</span>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
const rp = require('request-promise')

export default {
  name: 'channel-list',
  props: {
    currentChannel: Object
  },
  mounted () {
    this.changeChannel(this.currentChannel.name)
  },
  methods: {
    emitChannel (channel) {
      this.$emit('change-channel', channel)
    },
    changeChannel (channel) {
      console.log('----------------------------------------------------------------------------------------------------------------')
      console.log('> Changing to: ' + channel)
      let url = this.getChannelUrl(channel)
      this.$emit('destroy-stream')
      this.currentChannel.state = 'loading'
      console.log('> Loading')
      this.getStream(url)
    },
    getChannelUrl (channel) {
      console.log('> Getting channel URL')
      this.currentChannel.url = this.channels[channel].url
      this.currentChannel.logo = this.channels[channel].logo.url
      this.currentChannel.name = channel
      return this.channels[channel].url
    },
    getStream (url) {
      let self = this
      let options = {
        uri: encodeURI(url)
      }
      rp(options)
        .then(function (html) {
          console.log('> Scraping URL: ' + url)

          // success
          let scrapedUrl = html.substring(
            html.lastIndexOf('file: "') + 7,
            html.lastIndexOf('",auto')
          )

          if (scrapedUrl) {
            self.currentChannel.stream = scrapedUrl
            self.$emit('open-stream', scrapedUrl)
          }
        })
        .catch(function (err) {
          // error
          console.log(err)
        })
    }
  },
  data () {
    return {
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
  }
}
</script>

<style>

</style>
