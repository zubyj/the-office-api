<script>
import axios from 'axios'
import { event, pageview } from 'vue-gtag';
export default {
    data() {
        return {
            path: 'random',
            season: '5',
            episode: '12',
            character: 'Michael',
            line: "Sometimes I’ll start a sentence and I don’t even know where it’s going. I just hope I find it along the way."
        }
    },
    methods: {
        submitRequest() {
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

            // Log event in google analytics
            event('submit-api-request', {
                'event-category': 'documentation',
                'event_label': 'API request button clicked',
                'value': 1,
            })

        }
    }
}
</script>

<template>
    <div class="body">
        <span id="request">
            <span id="url">
                https://theofficescript.com/
            </span>

            <input v-model="path" id="textForm">

            <button @click="submitRequest()" id="submitBtn">
                Submit
            </button>
        </span>

        <div id="responseBody">
            Response
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
.body {
    margin-top: 3rem;
    border-radius: 20px;
    padding: 2rem;
    background-color: black;
}

#request {
    padding: .5rem;
    margin-top: 5rem;
}

#url {
    padding: .25rem;
    color: var(--light);
}

#textForm {
    width: 40%;
    padding: .25rem;
}

#submitBtn {
    color: white;
    border: 1px solid white;
    padding: .25rem;
}

#submitBtn:hover {
    color: var(--primary);
}

#responseBody {
    margin-top: 2rem;
    width: 35rem;
}

.paramName {
    color: var(--primary);
}
</style>
