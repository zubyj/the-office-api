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
    <h2 id="name">{{ name }}</h2>
    <span id="method">
      GET
      <span id="path">https://theofficescript.com{{ path }}</span>
    </span>

    <div class="description">
      {{ description }}
    </div>

    <h3 v-if="parameters" id="paramTitle">Arguments/Parameters</h3>
    <div v-for="(item, key) in parameters">
      <span id="paramName">{{ key }} : </span>
      <span id="paramDescription">
        {{ item }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.endpoint {
  margin-top: 3rem;
  margin-bottom: 4rem;
  border-top: 1px solid var(--light);
  padding-top: 2rem;
}

#name {
  color: #ffd700;
  margin-bottom: 3rem;
}

#method {
  color: var(--primary-alt);
  border: 1px solid var(--dark);
  padding: .5rem;
  border-radius: 5px;
}

#path {
  color: var(--light);
  padding: .5rem;
}

#paramTitle {
  padding-top: 1rem;
  color: var(--light);
  padding-bottom: 1rem;
}

#paramName {
  color: var(--primary-alt)
}

#paramDescription {
  color: var(--light)
}
</style>
