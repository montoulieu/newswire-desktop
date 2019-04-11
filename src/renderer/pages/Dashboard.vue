<template>
  <div id="wrapper" :class="{ 'dark-mode': isDarkMode }">
    <b-container fluid>
      <div class="row">
        <video-pane
          :currentChannel="currentChannel"
        />
        <sidebar :currentChannel="currentChannel" @open-stream="openStream" @destroy-stream="destroyStream"/>
      </div>
    </b-container>
  </div>
</template>

<script>
  import Sidebar from '@/components/Sidebar'
  import VideoPane from '@/components/VideoPane'
  import Hls from 'hls.js'
  let hls = new Hls({})
  const {api} = require('electron-util')
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
          name: 'ABC News',
          url: 'https://www.watchnews.pro/abc-news.html',
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
      isDarkMode: function () {
        return api.systemPreferences.isDarkMode()
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      openStream (url) {
        console.log('> Mounting: ' + url)
        let self = this
        if (Hls.isSupported()) {
          let video = document.getElementById('video')
          hls = new Hls({
            // debug: true
          })
          hls.attachMedia(video)
          hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            // console.log('video and hls.js are now bound together !')
            hls.loadSource(url)
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              console.log('> Streaming: ' + url)
              // console.log('manifest loaded, found ' + data.levels.length + ' quality level')
              video.play()
              self.currentChannel.state = 'loaded'
              console.log('> Loaded')
              console.log('----------------------------------------------------------------------------------------------------------------')
              console.log('')
            })
          })
        }
      },
      destroyStream () {
        console.log('> Destroy stream')
        hls.destroy()
      }
    }
  }
</script>
