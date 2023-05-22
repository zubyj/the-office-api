<script setup>
import Sidebar from './components/Sidebar.vue';
import Endpoint from './components/Endpoint.vue';
import ExampleRequest from './components/ExampleRequest.vue';
import RequestForm from './components/RequestForm.vue';
</script>
<template>
  <div class="app">
    <!-- Sidebar Navigation -->
    <Sidebar />
    <main>
      <div class="title">
        <img src="./assets/the-office-api-logo.jpg" width="400" id="title_img" />
        <h2 id="description">REST API for getting lines from NBC's " The Office"</h2>
        <div class="buttons">
          <a href="https://zubyj.com/the-office-chat-bot" target="_blank" class="button">Chat bots</a>
          <a href="https://reddit.com/u/the-office-bot" target="_blank" class="button">Reddit bots</a>
          <a href="https://github.com/zubyj/the-office-api" target="_blank" class="button">View the code</a>
        </div>
      </div>
      <RequestForm />

      <h1 class="title" id="docsTitle">API Documentation</h1>

      <!-- Ask the script -->
      <div id="ask_question">
        <Endpoint name="1. Ask the script" path="/ask/:question" :parameters="{
          question: 'text separated by hyphens'
        }" />
        <ExampleRequest path="/ask/i-declare-bankruptcy" season="4" episode="4" character="Oscar"
          line="Hey, I just wanted you to know that you can't just say the word bankruptcy and expect anything to happen." />
      </div>

      <!-- Ask a character -->
      <div id="ask_question_character">
        <Endpoint name="2. Ask a character" path="/characters/:character/ask/:question" :parameters="{
          question: 'text separated by hyphens',
          character: 'the first name of the character',
        }" />

        <div>
          <span id="disclaimer">Only the following characters are currently available</span>
          <div id="characterNames">
            dwight, michael, jim, pam, andy
          </div>
        </div>

        <ExampleRequest path="/characters/dwight/ask/bears-eat-beets" season="3" episode="20"
          line="Bears do not--- What is going on--- What are you doing?!" />
      </div>

      <!-- Gets a random line -->
      <div id="random_line">
        <Endpoint name="3. Get a random line" path="/random" />
        <ExampleRequest path="/random" season="5" episode="22" character="Michael"
          line="That sounds like a fantastic idea. I will see you this weekend for the Penguins. Box seats as usual." />
      </div>

      <!-- Gets a random line from character -->
      <div id="random_line_character">
        <Endpoint name="4. Get a random line from character" path="/characters/:character/random" :parameters="{
          character: 'the first name of the character',
        }" />
        <ExampleRequest path="/characters/dwight/random" season="1" episode="1"
          line="Downsizing? I have no problem with that. I have been recommending downsizing since I first got here. I even brought it up in my interview. I say, bring it on." />
      </div>

      <!-- Gets a random line from season and character -->
      <div id="random_line_season_character">
        <Endpoint name="5. Get a random line from season and character"
          path="/seasons/:season/characters/:character/random" :parameters="{
            season: 'the season number (1-9)',
            character: 'the first name of the character',
          }" />
        <ExampleRequest path="/seasons/1/characters/michael/random" episode="6"
          line="Yes. This is a Starbucks digital barista. This is the mack daddy of espresso makers." />
      </div>

      <!-- Gets a random line from season, episode, and character -->
      <div id="random_line_season_episode_character">
        <Endpoint name="6. Get a random line from season, episode, and character"
          path="/seasons/:season/episodes/:episode/characters/:character/random" :parameters="{
            season: 'the season number (1-9)',
            episode: 'the episode number',
            character: 'the first name of the character',
          }" />
        <ExampleRequest path="/seasons/2/episodes/1/characters/michael/random"
          line="Somebody, who I think a lot of us, cannot keep, from checking out. The 'Hottest in the Office' award goes to... ...Ryan the temp!" />
      </div>
    </main>
  </div>
</template>

<style lang="scss">
:root {
  --primary: #4ade80;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 275px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

/* Center the title and description */
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.button {
  font-family: 'Courier New', Courier, monospace;
  display: inline-block;
  margin: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  border: 1px solid white;
  text-decoration: none;
  color: #fff;
  background-color: var(--primary-alt);
  background-color: black;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--primary-alt);
  }
}

#docsTitle {
  padding-top: 3rem;
  color: var(--primary);
  font-size: 2rem;
}

#title_img {
  width: 100%;
}

.example {
  margin-bottom: 2rem;
}

#description,
#disclaimer {
  color: lightblue;
  padding-top: 1rem;
}

#characterNames {
  color: var(--light);
  margin-bottom: 2rem;
}

.app {
  display: flex;

  main {
    flex: 1 1 0;
    width: 25vw;

    @media (max-width: 1024px) {}
  }
}

@media (min-width: 1024px) {
  .app {
    width: 100%;
  }
}
</style>
