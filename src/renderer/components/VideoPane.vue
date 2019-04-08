<template>
  <div class="video-pane col-md-9 text-left order-2 px-0"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="embed-responsive embed-responsive-16by9 p-relative">
      <video
        class="embed-responsive-item"
        width="720"
        height="480"
        id="video"
        autoplay
        :controls="hovering ? 'controls' : false"
        :poster="currentChannel.logo ? currentChannel.logo : false"
      />
      <div class="spinner-container text-center d-flex justify-content-center align-items-center" v-if="currentChannel.state != 'loaded'">
        <b-spinner variant="primary" type="grow"></b-spinner>
      </div>
    </div>
  </div>
</template>

<script>
let Mousetrap = require('mousetrap')

export default {
  name: 'video-pane',
  props: {
    currentChannel: Object
  },
  mounted () {
    let video = document.getElementById('video')

    Mousetrap.bind('space', function (e) {
      e.preventDefault()
      if (!video.paused) {
        video.pause()
      } else {
        video.play()
      }
    })

    Mousetrap.bind('m', function () {
      if (!video.muted) {
        video.muted = true
      } else {
        video.muted = false
      }
    })

    Mousetrap.bind('up up down down left right left right b a enter', function () {
      require('electron').shell.openExternal('https://www.youtube.com/watch?v=NImW-Rs8eK8')
    })
  },
  data () {
    return {
      hovering: false
    }
  },
  method: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>
