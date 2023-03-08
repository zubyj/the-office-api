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

    <div id="requestDiv">
      <a :href="`https://www.theofficescript.com${path}`" id="request" target="_blank">
        theofficescript.com{{ path }}
      </a>
    </div>
    <div class="header">Response</div>
    {
    <br>
    <span v-if="season">season : {{ season }}<br></span>
    <span v-if="episode">episode : {{ episode }}<br></span>
    <span v-if="character">character : {{ character }}<br></span>
    <span v-if="line">line : {{ line }}<br></span>
    }
  </div>
</template>

<style scoped>
.example {
  color: var(--light);
  border: 1px solid var(--light);
  border-radius: 15px;
  padding: 1.5rem;
  width: 45rem;
  background-color: var(--dark);
}

#requestDiv {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

#request {
  color: var(--light);
  background-color: black;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid white;
}

#request:hover {
  color: var(--primary-alt)
}

.header {
  color: var(--primary-alt);
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
