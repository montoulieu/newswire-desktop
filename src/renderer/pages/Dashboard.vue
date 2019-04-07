<template>
  <div id="wrapper">
    <b-container fluid class="pt-3">
      <div class="row">
        <div class="col-md-8">
          <div class="embed-responsive embed-responsive-16by9">
            <video class="embed-responsive-item" width="720" height="480" id="video" autoplay controls></video>
          </div>
        </div>
        <div class="col-md-4">
          <b-list-group class="">
            <b-list-group-item variant="dark" button v-for="(url, channel) in channels" :key="channel.id" v-on:click="changeChannel(channel, channel.id)">{{channel}}</b-list-group-item>
          </b-list-group>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
  import ChannelList from '@/components/ChannelList'
  import Hls from 'hls.js'

  const rp = require('request-promise')
  const c = require('cheerio')

  export default {
    name: 'dashboard',
    components: { ChannelList },
    data () {
      return {
        currentChannelUrl: '',
        currentChannel: {
          id: 0,
          url: ''
        },
        currentStream: '',
        channels: {
          'MSNBC': {
            url: 'https://www.watchnews.pro/msnbc-news.html',
            favorited: false
          },
          'CNN': {
            url: 'https://www.watchnews.pro/cnn-news.html',
            favorited: false
          },
          'ABC News': {
            url: 'https://www.watchnews.pro/abc-news.html',
            favorited: false
          },
          'CBS News': {
            url: 'https://www.watchnews.pro/cbsn.html',
            favorited: false
          },
          'The Weather Channel': {
            url: 'https://www.watchnews.pro/the-weather-channel.html',
            favorited: false
          }
        }
      }
    },
    mounted () {
      // let self = this
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      changeChannel (channel, id) {
        console.log('Channel Selected: ' + channel)
        let url = this.getChannelUrl(channel, id)
        console.log(id)
        this.getStream(url)
      },
      getChannelUrl (channel, id) {
        this.currentChannel.url = this.channels[channel].url
        this.currentChannel.id = id
        return this.channels[channel].url
      },
      getStream (url) {
        let self = this
        let options = {
          uri: url
        }
        rp(options)
          .then(function (html) {
            // success
            let streamData = c('#myElement', html).next()[0].children[0].children[0].data

            let substring = streamData.substring(
              streamData.lastIndexOf('file: "') + 7,
              streamData.lastIndexOf('",auto')
            )

            console.log(substring)
            self.currentStream = substring
            self.openStream(substring)
          })
          .catch(function (err) {
            // error
            console.log(err)
          })
      },
      openStream (url) {
        if (Hls.isSupported()) {
          let video = document.getElementById('video')
          let hls = new Hls({
            // debug: true
          })

          console.log('hls loaded')
          console.log(url)

          hls.attachMedia(video)

          hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            console.log('video and hls.js are now bound together !')
            hls.loadSource(url)
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              console.log('manifest loaded, found ' + data.levels.length + ' quality level')
            })
          })
        }
      }
    }
  }
</script>
