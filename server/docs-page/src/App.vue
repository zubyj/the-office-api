<script setup>
  import Sidebar from './components/Sidebar.vue';
  import Endpoint from './components/Endpoint.vue';
  import Example from './components/Example.vue';
</script>

<template>
    <div class="app">
      <!-- Sidebar Navigation -->
      <Sidebar/>
      <main>
        <h1 id="appname">The Office API</h1>
        <h2 id="description">REST API for getting lines from NBC's "The Office"</h2>

        <!-- Ask the script -->
        <div id="ask_question">
          <Endpoint 
            name="Ask the script"
            path="/ask/:question"
            :parameters="{
              question: 'text separated by hyphens'
            }"
          />
          <Example
            path="/ask/i-declare-bankruptcy"
            season="4"
            episode="4"
            character="Oscar"
            line="Hey, I just wanted you to know that you can't just say the word bankruptcy and expect anything to happen."
          />
        </div>

        <!-- Ask a character -->
        <div id="ask_question_character">
          <Endpoint 
            name="Ask a character"
            path="/characters/:character/ask/:question"
            :parameters="{
              question: 'text separated by hyphens',
              character: 'the first name of the character',
            }"
          />

          <div>
            <span id="disclaimer">Only the following characters are currently available</span>
            <div id="characterNames">
              dwight, michael, jim, pam, andy
            </div>
          </div>

          <Example
            path="/characters/dwight/ask/bears-eat-beets"
            season="3"
            episode="20"
            line="Bears do not--- What is going on--- What are you doing?!"
          />
        </div>

        <!-- Gets a random line -->
        <div id="random_line">
          <Endpoint 
            name="Get a random line"
            path="/random"
          />
          <Example
            path="/random"
            season="5"
            episode="22"
            character="Michael"
            line="That sounds like a fantastic idea. I will see you this weekend for the Penguins. Box seats as usual."
          />
        </div>

        <!-- Gets a random line from character -->
        <div id="random_line_character">
          <Endpoint 
            name="Get a random line from character"
            path="/characters/:character/random"
            :parameters="{
              character: 'the first name of the character',
            }"
          />
          <Example
            path="/characters/dwight/random"
            season="1"
            episode="1"
            line="Downsizing? I have no problem with that. I have been recommending downsizing since I first got here. I even brought it up in my interview. I say, bring it on."
          />
        </div>

        <!-- Gets a random line from season and character -->
        <div id="random_line_season_character">
          <Endpoint
            name="Get a random line from season and character"
            path="/seasons/:season/characters/:character/random"
            :parameters="{
                season: 'the season number (1-9)',
                character: 'the first name of the character',
            }"
          />
          <Example
            path="/seasons/1/characters/michael/random"
            episode="6"
            line="Yes. This is a Starbucks digital barista. This is the mack daddy of espresso makers."
          />
        </div>

        <!-- Gets a random line from season, episode, and character -->
        <div id="random_line_season_episode_character">
          <Endpoint 
            name="Get a random line from season, episode, and character"
            path="/seasons/:season/episodes/:episode/characters/:character/random"
            :parameters="{
              season: 'the season number (1-9)',
              episode: 'the episode number',
              character: 'the first name of the character',
            }"
          />
          <Example
            path="/seasons/2/episodes/1/characters/michael/random"
            line="Somebody, who I think a lot of us, cannot keep, from checking out. The 'Hottest in the Office' award goes to... ...Ryan the temp!"
            />
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
	font-family: 'Fira sans', sans-serif;
}

#appname {
  font-size: 2rem;
  color: var(--primary-alt)
}

button {
	cursor: pointer;
	appearance: none;
	border: none;
	outline: none;
	background: none;
}

.example {
  margin-bottom: 2rem;
}

#disclaimer {
  color: lightblue;
}

#characterNames {
  color: var(--light);
  margin-bottom: 2rem;
}

.app {
  display: flex;

  main {
    flex: 1 1 0;
    width: 100%;

    @media (max-width: 1024px) {
    }
  }
}

@media (min-width: 1024px) {
  #appname {
    font-size: 3rem;
  }

  .app {
    margin-left: 4rem;
  }
}
</style>
