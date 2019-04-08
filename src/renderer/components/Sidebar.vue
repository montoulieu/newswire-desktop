<template>
  <div class="col-md-3 order-1 px-0 pt-4 border-right border-dark text-left">
    <header class="d-flex align-items-end pb-2">
      <h1 class="text-light font-weight-800 letter-spacing-1 text-left pl-4 pt-3 mb-0 d-inline-block">Newswire</h1>
      <span class="version bg-primary ml-2 mb-2 px-1 d-inline-block rounded">alpha {{ versionNumber }}</span>
    </header>
    <channel-list :currentChannel="currentChannel" :channels="channels" @open-stream="openStream" @destroy-stream="destroyStream"/>
    <!-- <footer class="pt-3 pl-3"></footer> -->
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
    },
    destroyStream () {
      this.$emit('destroy-stream')
    }
  }
}
</script>

<style>

</style>
