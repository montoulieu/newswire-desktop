<template>
  <div class="col-md-9 text-left order-2 px-0"
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
        <b-spinner variant="light" type="grow"></b-spinner>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'video-pane',
  props: {
    currentChannel: Object
  },
  data () {
    return {
      hovering: false
    }
  }
}
</script>
