<script setup>
defineProps({
  path: {
    type: String,
    required: true
  },
  season: {
    type: String,
    required: false
  },
  episode: {
    type: String,
    required: false
  },
  character: {
    type: String,
    required: false
  },
  line: {
    type: String,
    required: false
  },
})
</script>

<template>
    <div class="example">
      <h2>Example</h2>
      <div class="header">Request</div>
        <span >
            https://theofficescript.com<span>{{path}}</span>
        </span>
          
      <div class="header">Response</div>
          {
          <br>
            <span v-if="season">season :  {{season}}<br></span>
            <span v-if="episode">episode :  {{episode}}<br></span>
            <span v-if="character">character :  {{character}}<br></span>
            <span v-if="line">line :  {{line}}<br></span>
          }
    </div>
</template>

<style scoped>

.example {
  color: var(--light);
  padding: 1rem;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  
}

.header {
    color: var(--primary-alt);
    padding-top: 1rem;
    padding-bottom: 1rem;
}
</style>
