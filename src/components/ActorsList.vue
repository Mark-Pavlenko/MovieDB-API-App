<template>
    <div class="wrapper" v-if="listLoaded">
        <div class="actors" v-if="actors.length">

            <header class="actors__header">
                <h2 class="actors__title">{{ actorsTitle }}</h2>

                <span class="actors__results" v-if="!shortList">{{countResults}}</span>
                <router-link v-if="shortList" class="actors__link" :to="{ name: 'home-category', params: { category: category }}">
                    Больше
                </router-link>

            </header>

            <ul class="actors__list">
                <actors-list-item class="actors__item" v-for="(movie, index) in actors" :movie="movie"></actors-list-item>
            </ul>

            <div class="actors__nav" v-if="!shortList" :class="{ 'is-hidden': currentPage == pages }">
                <button @click="loadMore" class="button">Показать больше</button>
            </div>

        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import storage from "../storage.js";
    import ActorsListItem from "./ActorsListItem.vue";

    export default {
        props: ["type", "mode", "category", "shortList"],
        components: { ActorsListItem },
        data() {
            return {
                actorsTitle: "",
                actors: [],
                pages: "",
                results: "",
                currentPage: 1,
                listLoaded: false,
            };
        },
        computed: {
            pageTitle() {
                return this.actorsTitle;
            },
            query() {
                return this.$route.params.query || "";
            },
            request() {
                if (this.mode == "search") {
                    return `https://api.themoviedb.org/3/search/movie?api_key=${storage.apiKey}&language=ru&query=${this.query}&page=${this.currentPage}`;
                } else if (this.mode == "collection") {
                    let caregory = this.$route.params.category || this.category;
                    return `https://api.themoviedb.org/3/movie/${caregory}?api_key=${storage.apiKey}&language=ru&page=${this.currentPage}`;
                } else if (this.mode == "favorite") {
                    return `https://api.themoviedb.org/3/account/${storage.userId}/favorite/actors?api_key=${storage.apiKey}&session_id=${storage.sessionId}&language=en-US&sort_by=created_at.desc&page=${this.currentPage}`;
                }
            },
            countResults() {},
        },
        methods: {
            fetchActor() {
                axios
                    .get(this.request)
                    .then(
                        function (resp) {
                            let data = resp.data;
                            if (this.shortList) {
                                this.actors = data.results.slice(0, 10);
                                this.pages = 1;
                                this.results = 10;
                            } else {
                                this.actors = data.results;
                            }
                            this.listLoaded = true;
                            // Change Page title
                            if (this.type == "page") {
                                document.title = this.pageTitle;
                            }
                        }.bind(this)
                    )
                    .catch(
                        function (error) {
                            console.log(error);
                        }
                    );
            },
            loadMore() {
                this.currentPage++;
                axios.get(this.request).then(
                    function (resp) {
                        let data = resp.data;
                        let newData = this.actors.concat(data.results);
                        this.actors = newData;
                    }.bind(this)
                );
            },
        },
        watch: {
            query(value) {
                this.fetchActor(value);
            },
        },
        created() {
            // Set List Title
            if (this.mode === "search") {
                this.actorsTitle = storage.categories["search"];
                eventHub.$emit("setSearchQuery");
            } else if (this.mode === "collection") {
                let caregory = this.$route.params.category || this.category;
                this.actorsTitle = storage.categories[caregory];
            } else if (this.mode === "favorite") {
                this.actorsTitle = storage.categories["favorite"];
            }
            this.fetchActor();
        },
    };
</script>

<style lang="scss">
    @import "./src/scss/variables";
    @import "./src/scss/media-queries";
    .actors {
        padding: 10px;
        @include tablet-min {
            padding: 15px;
        }
        @include tablet-landscape-min {
            padding: 25px;
        }
        @include desktop-min {
            padding: 30px;
        }
        &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 10px;
            @include tablet-min {
                padding: 23px 15px;
            }
            @include tablet-landscape-min {
                padding: 16px 25px;
            }
            @include desktop-min {
                padding: 8px 30px;
            }
        }
        &__title {
            margin: 0;
            font-size: 16px;
            line-height: 16px;
            color: $c-dark;
            font-weight: 300;
            @include tablet-min {
                font-size: 18px;
                line-height: 18px;
            }
        }
        &__results {
            font-size: 12px;
            font-weight: 300;
            letter-spacing: 0.5px;
            color: rgba($c-dark, 0.5);
        }
        &__link {
            font-size: 12px;
            font-weight: 300;
            letter-spacing: 0.5px;
            color: rgba($c-dark, 0.5);
            text-decoration: none;
            transition: color 0.5s ease;
            &:after {
                content: " →";
            }
            &:hover {
                color: $c-dark;
            }
        }
        &__list {
            padding: 0;
            margin: 0;
            list-style: none;
            display: flex;
            flex-wrap: wrap;
        }
        &__item {
            padding: 10px;
            width: 50%;
            @include tablet-min {
                padding: 15px;
            }
            @include tablet-landscape-min {
                padding: 20px;
                width: 25%;
            }
            @include desktop-min {
                padding: 30px;
                width: 20%;
            }
        }
        &__nav {
            padding: 25px 0;
            text-align: center;
            &.is-hidden {
                display: none;
            }
        }
    }
</style>
