<template>

    <div class="profile__content">
        <header class="profile__header">
            <h2 class="profile__title">Здравствуйте, {{ user.name + ' ' + user.surname}}!</h2>
            <button class="button" @click="logUserOut">Выйти</button>
        </header>

        <section>

            <div class="container mt-5">
                <div class="row">
                    <h1 style="text-align: center; padding-top: 20px; margin-bottom: -10px;">Избранные фильмы</h1>
                    <div class="col-md-12">
                        <ul class="list-group">
                            <ul class="movies__list">
                                <movies-list-item class="movies__item" v-for="movie in arraysId"
                                                  :movie="movie "></movies-list-item>
                            </ul>
                        </ul>
                    </div>
                </div>
            </div>

        </section>
    </div>

</template>

<script>
    import axios from 'axios'
    import MoviesListItem from "../components/MoviesListItem.vue";
    import storage from "src/storage";

    export default {
        props: ['id, movie'],
        components: {MoviesListItem},
        data() {
            return {
                user: {},
                movie: {},
                // favouriteFilms: [],
                info: null,
                arraysId: []
            };
        },
        mounted() {
            this.getUserDetails();
        },
        created() {

        },
        methods: {
            async getUserDetails() {
                const userId = JSON.parse(localStorage.getItem('user'))._id;
                console.log(userId)
                await  this.$http.get(`user/getUser/${userId}`)
                    .then((response) => {
                        this.user  = response.data
                        for (let film in this.user.favouriteFilms) {
                            let filmId = this.user.favouriteFilms[film]
                            console.log(this.user)
                            axios
                                .get(`https://api.themoviedb.org/3/movie/${filmId.film}?api_key=${storage.apiKey}&language=ru`)
                                .then((response) => {
                                    this.arraysId.push(response.data)
                                });
                        }
                        console.log(this.arraysId)
                    });
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

        .row .favouriteTitle {
            text-align: center;
        }
    }
</style>