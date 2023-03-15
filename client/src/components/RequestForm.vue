<!-- This VueJS component provides a user interface for making API requests and displaying the response.
     The user inputs a path to an API endpoint, and the component sends a GET request to the endpoint using the axios library.
     The response is then displayed in the UI.
     The component also handles loading and error states, and logs events to Google Analytics. -->

<script>
import axios, { isAxiosError } from 'axios'
import { event, pageview } from 'vue-gtag';

export default {
    data() {
        return {
            loading: false, // A boolean value indicating whether the component is waiting for a 
            error: false, // A boolean value indicating whether the most recent API request resulted in an error
            path: 'random', // The path to the API endpoint
            season: '5',
            episode: '12',
            character: 'Michael',
            line: "Sometimes I’ll start a sentence and I don’t even know where it’s going. I just hope I find it along the way."
        }
    },
    methods: {
        submitRequest() {
            this.isLoading(true); // Show loading spinner
            // Send GET request to the API endpoint
            axios
                .get('https://www.theofficescript.com/' + this.path)
                .then(response => {
                    this.season = response.data.season;
                    this.episode = response.data.episode;
                    this.character = response.data.character;
                    this.line = response.data.line;
                    this.response = response.data.response;
                    this.isError(false);
                })
                .catch(err => {
                    console.log(err);
                    this.isError(true)
                })
                /* On success, show response in console */
                .finally(() => {
                    this.isLoading(false);
                });
            // Log event in google analytics
            event('submit-api-request', {
                'event-category': 'documentation',
                'event_label': 'API request button clicked',
                'value': 1,
            })
        },
        isLoading(status) {
            this.loading = status;
        },
        isError(status) {
            this.error = status;
        }

    },
}
</script>

<template>
    <!-- The UI elements are rendered based on the loading and error states -->
    <div class="body">
        <!-- Message displayed to user -->
        <h2 class="title">
            <div v-if="loading" id="loadingMsg">Awaiting API Response
            </div>
            <div v-else>
                <div v-if="error" id="errorMsg">
                    Invalid request. Try again.
                </div>
                <div v-else>
                    Try an API request
                </div>
            </div>
        </h2>
        <!-- API Request Text Form -->
        <div class="container">
            <div>
                <span id="request">
                    <span id="url">
                        https://theofficescript.com/
                    </span>
                    <input v-model="path" id="textForm" @keypress.enter="submitRequest" autofocus>
                </span>
            </div>
            <button @click="submitRequest()" id="submitBtn">
                <a>Get Response</a>
            </button>
        </div>
        <!-- API Response -->
        <div id="responseBody">
            <div>
                <span class="paramName"> season </span> : {{ season }}
            </div>
            <div>
                <span class="paramName"> episode </span> : {{ episode }}
            </div>
            <div>
                <span class="paramName"> character </span> : {{ character }}
            </div>
            <div>
                <span class="paramName"> line </span> : {{ line || response }}
            </div>
        </div>
    </div>
</template>

<style scoped>
input {
    font-size: 1rem;
}

.body {
    margin-top: 1rem;
    border-radius: 10px;
    padding: 1rem;
    background-color: black;
    max-width: 100vw;
    margin-top: 5rem;
}

#loadingMsg {
    color: var(--primary-alt);
}

#errorMsg {
    color: #ff0033;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#request {
    display: flex;
    align-items: center;
    padding: .5rem;
    margin-top: 2rem;
}

#url {
    color: var(--light);
    margin-right: 0.5rem;
}

#textForm {
    border: 1px solid white;
    background-color: transparent;
    color: var(--light);
    padding: .25rem;
    border-radius: 5px;
    width: 100%;
}

#submitBtn {
    margin-top: 1rem;
    background-color: black;
    border: none;
    color: var(--light);
    padding: 1rem;
    margin-top: 2rem;
}

#submitBtn:hover {
    color: var(--primary-alt);
}

/* Submit Button with Hover Effect */
#submitBtn {
    color: var(--primary);
    padding: .5rem;
    margin-left: 5rem;
    padding-bottom: .25rem;
}

a {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #cecd24;
    text-decoration: none;
    font-size: .8rem;
    display: inline-block;
    font-family: Montserrat;
    text-transform: uppercase;
    padding: 0.2em 2em;
    border: 2px solid #cecd24;
    transition: 0.02s 0.2s cubic-bezier(0.1, 0, 0.1, 1);
}

a::before {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    right: 100%;
    bottom: 0;
    background: #cecd24;
    transition: 0.3s 0.2s cubic-bezier(0.1, 0, 0.1, 1), left 0.3s cubic-bezier(0.1, 0, 0.1, 1);
    z-index: -1;
}

a::after {
    content: "";
    display: inline-block;
    background-image: url("https://cdn-icons-png.flaticon.com/128/109/109617.png");
    position: absolute;
    top: 0;
    left: calc(100% - 3em);
    right: 3em;
    bottom: 0;
    background-size: 1.5em;
    background-repeat: no-repeat;
    background-position: center;
    transition: right 0.3s cubic-bezier(0.1, 0, 0.1, 1);
}

a:hover {
    padding: 0.5em 3.5em 0.5em 0.5em;
}

a:hover::before {
    left: calc(100% - 3em);
    right: 0;
    transition: 0.3s cubic-bezier(0.1, 0, 0.1, 1), left 0.3s 0.2s cubic-bezier(0.1, 0, 0.1, 1);
}

a:hover::after {
    right: 0;
    transition: right 0.3s 0.2s cubic-bezier(0.1, 0, 0.1, 1);
}

#responseBody {
    margin-top: 2rem;
    color: var(--light);
}

.paramName {
    color: var(--primary);
}

@media (min-width: 1024px) {
    #textForm {
        width: 350px;
    }
}
</style>
