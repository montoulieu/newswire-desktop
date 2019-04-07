<template>
  <div class="col-md-3 order-1 px-0 pt-4 border-right border-dark text-left">
    <header class="d-flex align-items-end pb-2">
      <h1 class="text-light font-weight-800 letter-spacing-1 text-left pl-4 pt-3 mb-0 d-inline-block">Newswire</h1>
      <span class="version bg-danger ml-2 mb-2 px-1 d-inline-block rounded">alpha {{ versionNumber }}</span>
    </header>

    <channel-list :currentChannel="currentChannel" :channels="channels" @open-stream="openStream"/>
    <!-- <div class="pt-3 pl-3">
      <b-button v-b-modal.modal-1 size="sm" variant="outline-gray" class="mt-1"><img src="static/icons/settings.svg" height="24"></b-button>
    </div> -->
  </div>
</template>

<script>
import ChannelList from '@/components/ChannelList'

export default {
  name: 'sidebar',
  props: {
    channels: Object,
    currentChannel: Object
  },
  components: {
    ChannelList
  },
  computed: {
    versionNumber: function () {
      var pjson = require('../../../package.json')
      return pjson.version
    }
  },
  methods: {
    openStream (stream) {
      this.$emit('open-stream', stream)
    }
  }
}
</script>

<style>

</style>
