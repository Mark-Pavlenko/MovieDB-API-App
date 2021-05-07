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
                            <div v-for="film in user.favouriteFilms">{{film.film}}</div>
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
    export default {
        data() {
            return {
                user: {},
                favouriteFilms: ''
            };
        },
        // mounted() {
        //     axios
        //         .get(`http://localhost:4000/user/getFilms`)
        //         .then(response => (this.favouriteFilms = response));
        // },
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
                try {
                    await this.$http.get(`/user/getFilms`, {favouriteFilms})
                        .then(response => {
                            console.log(response)
                        })
                } catch (err) {
                    let error = err.response;
                    console.log(error);
                }
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