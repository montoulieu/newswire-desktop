<template>
  <div>
    <b-list-group class="pt-1">
      <b-list-group-item button v-for="(options, channel) in channels" :key="channel.id" v-on:click="changeChannel(channel)" class="py-0 pl-4">
        <img :src="options.logo.url" v-if="options.logo.url" :height="options.logo.height">
        <span class="label" v-if="!options.logo.url">{{channel}}</span>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: 'channel-list',
  props: {
    'channels': Object
  },
  methods: {
    changeChannel (channel) {
      this.$emit('change-channel', channel)
    }
  }
}
</script>

<style>

</style>
