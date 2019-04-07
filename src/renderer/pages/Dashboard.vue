<template>
  <div id="wrapper" :class="{ 'theme-dark': darkMode }">
    <b-container fluid class="">
      <div class="row">
        <video-pane
          :currentChannel="currentChannel"
        />
        <sidebar :currentChannel="currentChannel" @open-stream="openStream"/>
      </div>
    </b-container>
  </div>
</template>

<script>
  import Sidebar from '@/components/Sidebar'
  import VideoPane from '@/components/VideoPane'
  import Hls from 'hls.js'
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
        currentChannel: {
          name: 'MSNBC',
          url: 'https://www.watchnews.pro/msnbc-news.html',
          stream: '',
          logo: '',
          state: ''
        }
      }
    },
    mounted () {
      // let self = this
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
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              console.log('> Opened Stream: ' + url)
              // console.log('manifest loaded, found ' + data.levels.length + ' quality level')
              video.play()
              self.currentChannel.state = 'loaded'
              console.log('> Loaded')
              console.log('----------------------------------------------------------------------------------------------------------------')
              console.log('')
            })
          })
        }
      }
    }
  }
</script>
