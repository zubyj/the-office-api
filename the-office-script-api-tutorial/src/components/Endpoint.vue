<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  parameters: {
    type: Object,
    required: false,
  },

})
</script>

<template>
  <div class="endpoint">
    <h2 id="name">{{name}}</h2>
    <span id="method">
        GET
    </span>
    <button id="path">
        https://theofficescript.com{{path}}
    </button>
    <div class="description">
        {{description}}
    </div>

    <h3 v-if="parameters" id="paramTitle">Arguments</h3>
    <div v-for="(item, key) in parameters">
      <span id="paramName">{{key}} : </span> 
      <span id="paramDescription">
        {{item}}
      </span>
    </div>

    <!-- <div v-for="param in parameters" id="parameterTitle">
      {{param}}
    </div> -->
  </div>
</template>

<style scoped>

.endpoint {
  padding-top: 3rem;
  padding-bottom: 2rem;
}

#name {
    color: #ffd700;
    margin-bottom: 1rem;
}

#method {
    color: var(--primary-alt);
    
}

#path {
    background-color: var(--dark);
    color: var(--light);
    border: 1px solid var(--dark);
    border-radius: 10px;
    padding: .5rem;
    
}

#paramTitle {
  padding-top: 1rem;
  color: var(--light);
  
}

#paramName {
  color: var(--primary-alt)
}

#paramDescription {
  color: var(--light)
}

</style>
