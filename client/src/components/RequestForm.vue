<script>
import axios from 'axios'
import { event, pageview } from 'vue-gtag';
export default {
    data() {
        return {
            loading: false,
            path: 'random',
            season: '5',
            episode: '12',
            character: 'Michael',
            line: "Sometimes I’ll start a sentence and I don’t even know where it’s going. I just hope I find it along the way."
        }
    },
    methods: {
        submitRequest() {
            this.isLoading(true); // Show loading spinner
            axios
                .get('https://www.theofficescript.com/' + this.path)
                .then(response => {
                    this.season = response.data.season;
                    this.episode = response.data.episode;
                    this.character = response.data.character;
                    this.line = response.data.line;
                    this.response = response.data.response;
                })
                .catch(err => {
                    console.log(err);
                })
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
        }
    }
}
</script>

<template>
    <div class="body">
        <h2 id="title">
            <div v-if="loading" id="loadingTitle">Awaiting API Response</div>
            <div v-else>
                Make an API Request
            </div>
        </h2>
        <span id="request">
            <span id="url">
                https://theofficescript.com/
            </span>

            <input v-model="path" id="textForm" @keypress.enter="submitRequest" autofocus>

            <button @click="submitRequest()" id="submitBtn">
                <a>
                    Get Response
                </a>
            </button>
        </span>

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
    margin-top: 3rem;
    border-radius: 20px;
    padding: 1rem;
    background-color: black;
    max-width: 100vw;
}

#loadingTitle {
    color: var(--primary);
}

#request {
    padding: .5rem;
    margin-top: 5rem;
}

#responseBody {
    margin-top: 5rem;
    color: var(--light);
}

#url {
    padding: .25rem;
    color: var(--light);
    font-size: 1.25rem;
}

#textForm {
    width: 40%;
    padding: .5rem;
    background-color: black;
    color: white;
    border: 1px solid white;
    border-radius: 10px;
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
    font-size: 1rem;
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
}

.paramName {
    color: var(--primary);
}
</style>
