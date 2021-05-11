<template>

    <div class="profile__content">
        <header class="profile__header">
            <h2 class="profile__title">Здравствуйте, {{ user.name + ' ' + user.surname}} !</h2>
            <button class="button" @click="logUserOut">Выйти</button>
        </header>

        <section>
            <div class="container mt-5">
                <div class="row">
                    <div class="col-md-12">
                        <ul class="list-group">
                            <div v-for="favouriteFilm in this.arraysId">
                                {{favouriteFilm.title}}
                                {{favouriteFilm.id}}<!--                                <div>{{info}}</div>-->
<!--                                <ul class="movies__list">-->
<!--                                    <movies-list-item class="movies__item" v-for="favouriteFilm in user.favouriteFilms" :favouriteFilm ="favouriteFilm.film "></movies-list-item>-->
<!--                                </ul>-->
                            </div>
                         </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>

</template>

<script>
    import VueJwtDecode from "vue-jwt-decode";
    import axios from 'axios'
    import MoviesListItem from "../components/MoviesList.vue";
    import storage from "src/storage";
    export default {
        props: ['id, movie'],
        components: { MoviesListItem },
        data() {
            return {
                user: {},
                movie: {},
                favouriteFilms: [],
                info: null,
                arraysId:[]
            };
        },
        mounted() {
            for (let film in this.user.favouriteFilms){
                console.log(this.user.favouriteFilms[film])
                let filmId = this.user.favouriteFilms[film]

            axios
                .get(`https://api.themoviedb.org/3/movie/${filmId.film}?api_key=${storage.apiKey}&language=ru`)
                .then((response) => {
                    this.info = response.data
                    this.arraysId.push(response.data)


                });

            }
            console.log(this.arraysId)
        },
        created() {
            this.getUserDetails();
            this.getFavouriteFilms();
        },
        methods: {
            getUserDetails() {
                let token = localStorage.getItem("jwt");
                let decoded = VueJwtDecode.decode(token);
                this.user = decoded;
            },
            async getFavouriteFilms() {
            },
            logUserOut() {
                localStorage.removeItem("jwt");
                this.$router.push("/login");
            }
        },
    };
</script>

<style lang="scss">
    @import "./src/scss/variables";
    @import "./src/scss/media-queries";
    .profile {
        &__content {
            .wrapper {
                min-height: calc(100vh - 175px);
                @include tablet-min {
                    min-height: calc(100vh - 171px);
                }
            }
        }
        &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            border-bottom: 1px solid rgba($c-dark, 0.05);
            @include tablet-min {
                padding: 29px 30px;
            }
            @include tablet-landscape-min {
                padding: 29px 50px;
            }
            @include desktop-min {
                padding: 29px 60px;
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
    }
</style>