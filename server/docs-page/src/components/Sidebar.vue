<script setup>
    import { ref } from 'vue';

    const is_expanded = ref(false)

    const ToggleMenu = () => {
        is_expanded.value = !is_expanded.value
    }
</script>

<template>
    <aside :class="{is_expanded}">
        <div class="logo">
            <img src="../assets/logo.svg" alt="Vue">
        </div>
        <div class="menu-toggle-wrap">
            <button class="menu-toggle" @click="ToggleMenu">
                <span class="material-icons">keyboard_double_arrow_right</span>
            </button>
        </div>
        <div class="menu">
            <h2 v-if="is_expanded" id="title" class="text">Endpoints</h2>
            <ul class="nav">
                <li class="nav-item"><a href="#random_line">
                    <span class="material-icons">filter_1</span> 
                    <span v-if="is_expanded" class="text">Get random line</span> 
                </a></li>
                <li class="nav-item"><a href="#random_line_character">
                    <span class="material-icons">filter_2</span>
                    <span v-if="is_expanded" class="text">Get random line from character</span>
                </a></li>
                <li class="nav-item"><a href="#random_line_season_character">
                    <span class="material-icons">filter_3</span>
                    <span v-if="is_expanded" class="text">Get random line from season and character</span>
                </a></li>
                <li class="nav-item"><a href="#random_line_season_episode_character">
                    <span class="material-icons">filter_4</span>
                    <span v-if="is_expanded" class="text">Get random line from season, episode, and character</span>
                </a></li>
                <li class="nav-item"><a href="#ask_question">
                    <span class="material-icons">filter_5</span>
                    <span v-if="is_expanded" class="text">Ask the script</span>
                </a></li>
                <li class="nav-item"><a href="#ask_question_character">
                    <span class="material-icons">filter_6</span>
                    <span v-if="is_expanded" class="text">Ask a character</span>
                </a></li>
            </ul>
        </div>
    </aside>
</template>

<style lang="scss" scoped>
    aside {
        position: fixed;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        width: 6rem;
        max-height: 100vh;
        overflow: hidden;
        justify-content: baseline;
        background-color: var(--dark);
        color: var(--light);
        transition: 0.2s ease-out;
        display: none;

        .logo {
            margin-bottom: 1rem;
            display: flex;
            justify-content: flex-start;

            img {
                width: 2rem;
            }
        } 

        .menu-toggle-wrap {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 1rem;
            position: relative;
            top: 10px;
            transition: 0.2s ease-out;

            .menu-toggle {
                transition: 0.2s ease-out;
                .material-icons {
                    font-size: 2rem;
                    color: var(--light);
                    transition: 0.2s ease-out;
                }

                &:hover {
                    .material-icons, .text {
                        color: var(--primary);
                        transform: translateX(0.5rem);
                    }
                }
            }
        }

        .text {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }

        .menu {
            .nav-item a {
                display: flex;
                align-items: center;
                text-decoration: none;
                transition: 0.2s ease-in-out;

                .material-icons {
                    font-size: 2rem;
                }
                &:hover {
                    .material-icons {
                        color: var(--primary);
                    }
                }
            }
        }



        &.is_expanded {
            width: var(--sidebar-width);

            .menu-toggle-wrap {
                top: -3rem;

                .menu-toggle {
                    transform: rotate(-180deg);
                }
            }

            .text {
                opacity: 1;
            }

            .nav-item {
                .material-icons {
                    margin-right: 1rem;
                }
            }
        }

        #title {
            text-align: center;
        }

        .nav-item {
            padding: 1rem;

            .material-icons {
                color: var(--light);
                margin-right: 1rem;
            }
        }

        ul {
            list-style: none;
        }

        @media (max-width: 768px) {
            position: fixed;
            z-index: 99;
        }
    }

    @media (min-width: 1024px) {
        aside {
            width: 6rem;
            padding: 1rem;
            display: flex;
            }
    }
</style>