<template>

  <div class="profile__content">
    <header class="profile__header">
      <h2 class="profile__title">Ваши рекомендации</h2>
      <div class="buttons" style="float: right; margin-top: -30px; ">
        <router-link to="/profile" class="button" style="text-decoration: none;">Профиль</router-link>
        <!--        <button class="button" @click="logUserOut">Выйти</button>-->
      </div>

    </header>

    <section>

      <div class="container mt-5">
        <div class="row">
          <h1 style="text-align: center; padding-top: 20px; margin-bottom: -10px;">Фильмы с найвысшими пользовательскими
            рейтингами </h1>
          <div class="col-md-12">
            <ul class="list-group">
              <ul class="movies__list">
                <movies-list-item class="movies__item" v-for="movie in outputRecommendedFeaturedFilms"
                                  :movie="movie "></movies-list-item>
              </ul>

<!--              <h1>Test</h1>-->

<!--              <ul class="movies__list">-->
<!--                <movies-list-item class="movies__item" v-for="movie in this.arrGenres"-->
<!--                                  :movie="movie "></movies-list-item>-->
<!--              </ul>-->

            </ul>
          </div>
        </div>
      </div>

      <div class="container mt-5" v-if="listLoaded">
        <div class="row">
          <h1 style="text-align: center; padding-top: 20px; margin-bottom: -10px;">
            Рекомендуемые фильмы вашего любимого жанра
          </h1>
          <div class="col-md-12">
            <ul class="list-group">
              <ul class="movies__list">
                <movies-list-item class="movies__item" v-for="movie in this.arrGenres"
                                  :movie="movie "></movies-list-item>
                <movies-list-item class="movies__item" v-for="movie in this.genreMovies"
                                  :movie="movie "></movies-list-item>
              </ul>
              <div class="movies__nav" v-if="shortList">
                <button @click="loadMoreGenreFilms" class="button">Показать больше</button>
              </div>
            </ul>
          </div>
        </div>
      </div>

      <div class="container mt-5" v-if="listLoaded">
        <div class="row">
          <h1 style="text-align: center; padding-top: 20px; margin-bottom: -10px;">
            Рекомендуемые фильмы с вашим любимым актером</h1>
          <div class="col-md-12">
            <ul class="list-group">
              <ul class="movies__list">
                <movies-list-item class="movies__item" v-for="movie in actorMovies2"
                                  :movie="movie "></movies-list-item>
              </ul>

              <div class="movies__nav">
                <button @click="loadMoreActorsFilms" class="button">Показать все</button>
              </div>
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
import img from "../directives/v-image";
import formatDate from "../directives/v-formatDate";

export default {

  props: ['type', 'id, movie'],

  components: {MoviesListItem},

  computed:{
    pageTitle() {
      return this.listTitle;
    }
  },

  created(){
    this.listTitle = storage.categories["recommendations"];
  },

  data() {
    return {
      filmId: this.id,
      movie: {},
      arraysId: [],
      rating: this.rating,
      //---------

      favouriteActorIds: [],
      filmsIdsOfFavouriteActor: [],

      featuredFilms: [],
      featuredUserFilms: [],
      featuredUserFilmsArr: [],
      recommendedFeaturedFilms: [],
      outputRecommendedFeaturedFilms: [],

      featuredUserGenresArr: [],
      featuredUserGenresIds: [],
      mostRepeatedGenreName: '',
      mostRepeatedGenreId: '',

      //--------

      listTitle: "",
      pages: "",
      results: "",
      currentPage: 1,
      listLoaded: false,

      //-------------

      actorMovies: [],
      actorMovies2: [],
      shortList: true,
      finalResult: [],

      genreMovies: [],
      arrGenres: []
    };
  },

  directives: {
    img: img,
    formatDate: formatDate
  },

  mounted() {
    if (localStorage.getItem('reloaded')) {
      localStorage.removeItem('reloaded');
    } else {
      localStorage.setItem('reloaded', '1');
      location.reload();
    };

    //get 1 page of films for genre actors
    axios
        .get(`https://api.themoviedb.org/3/discover/movie?api_key=${storage.apiKey}&with_genres=${this.mostRepeatedGenreId}&language=ru&page=1`)
        .then(function (response) {
          console.log(response.data);
          for(let i=0; i < response.data.results.length; i++){
            this.arrGenres.push(response.data.results[i]);
          }
          console.log(this.arrGenres);

        }.bind(this))
        .catch(
            function (error) {
              console.log(error);
            }
        );

    this.getUserDetails();

    //get movie rating for special user
    axios.get(`http://localhost:4000/user/allUsers`)
        .then(response => {
          this.users = response.data;
          for (let i = 0; i < this.users.length; i++) {
            if (`"${this.users[i].name}"` === localStorage.userName) {
              for (let j = 0; j < this.users[i].ratingFilms.length; j++) {
                if (this.users[i].ratingFilms[j].filmId === this.filmId) {
                  this.rating = this.users[i].ratingFilms[j].filmRating;
                  return this.rating;
                }
              }
            }
          }
        });

    //get the id`s array of recommended films for user (except the repeated)
    //get the id`s array of favourite actors of the user
    axios.get(`http://localhost:4000/user/allUsers`)
        .then(response => {
          let users = response.data;
          // console.log(response.data);

          //get featuredFilms and featuredUserFilms arrays
          for (let i = 0; i < users.length; i++) {
            if (`"${this.users[i].name}"` === localStorage.userName) {

              //get featuredUserFilms arrays
              for (let j = 0; j < this.users[i].featuredFilms.length; j++) {
                this.featuredUserFilms.push(this.users[i].featuredFilms[j].filmId);
              }

              //get favouriteActors array of IDs for specific User
              for (let j = 0; j < this.users[i].favouriteActors.length; j++) {
                this.favouriteActorIds.push(this.users[i].favouriteActors[j].actorId);
                // console.log(this.favouriteActorIds)
              }

            } else {
              //get featuredFilms  arrays
              for (let j = 0; j < this.users[i].featuredFilms.length; j++) {
                this.featuredFilms.push(this.users[i].featuredFilms[j].filmId);
              }
            }
          }

          // console.log(this.featuredFilms);
          // console.log(this.featuredUserFilms);
          let array = this.featuredFilms;
          this.recommendedFeaturedFilms = array.filter(function (elem, pos) {
            return array.indexOf(elem) === pos;
          });
          // console.log(this.recommendedFeaturedFilms);
          for (let i = 0; i < this.recommendedFeaturedFilms.length; i++) {
            // console.log(this.recommendedFeaturedFilms[i]);
            axios
                .get(`https://api.themoviedb.org/3/movie/${this.recommendedFeaturedFilms[i]}?api_key=${storage.apiKey}&language=ru`)
                .then((response) => {
                  this.outputRecommendedFeaturedFilms.push(response.data);
                  // console.log(response.data);
                });
          }
          // console.log(this.outputRecommendedFeaturedFilms);
        });

    //get the recommendations of films by the most popular genre`s ID
    //get the recommendations of films by the most popular favourite actor`s ID
    axios.get(`http://localhost:4000/user/allUsers`)
        .then(response => {

          //function to find the most repeated value in the array
          function mostFrequent(arr, n) {
            // Sort the array
            arr.sort();

            // find the max frequency using linear
            // traversal
            let max_count = 1, res = arr[0];
            let curr_count = 1;

            for (let i = 1; i < n; i++) {
              if (arr[i] == arr[i - 1])
                curr_count++;
              else {
                if (curr_count > max_count) {
                  max_count = curr_count;
                  res = arr[i - 1];
                }
                curr_count = 1;
              }
            }

            // If last element is most frequent
            if (curr_count > max_count) {
              max_count = curr_count;
              res = arr[n - 1];
            }
            return res;
          }

          for (let i = 0; i < this.featuredUserFilms.length; i++) {
            axios
                .get(`https://api.themoviedb.org/3/movie/${this.featuredUserFilms[i]}?api_key=${storage.apiKey}&language=ru`)
                .then((response) => {
                  this.featuredUserFilmsArr.push(response.data);
                  for (let j = 0; j < this.featuredUserFilmsArr.length; j++) {
                    this.featuredUserGenresArr = this.featuredUserFilmsArr[j].genres;
                  }
                  //console.log(this.featuredUserGenresArr); //arrays of all genres for every featured films
                  for (let k = 0; k < this.featuredUserGenresArr.length; k++) {
                    this.featuredUserGenresIds.push(this.featuredUserGenresArr[k].id);
                  }
                  // console.log(this.featuredUserGenresIds);

                  this.mostRepeatedGenreId = mostFrequent(this.featuredUserGenresIds, this.featuredUserGenresIds.length);
                  //console.log('The most popular user`s genre Id: ' + mostRepeated);
                  axios
                      .get(`https://api.themoviedb.org/3/discover/movie?api_key=${storage.apiKey}&with_genres=${this.mostRepeatedGenre}&language=ru`)
                      .then(function (response) {
                        let data = response.data;

                          this.genreMovies = data.results.slice(0, 10);
                          this.pages = 1;
                          this.results = 10;
                        this.listLoaded = true;
                        if (this.type === "page") {
                          document.title = this.pageTitle;
                        }
                      }.bind(this))
                      .catch(
                          function (error) {
                            console.log(error);
                          }
                      );
                });
          }

          this.mostRepeatedActorId = mostFrequent(this.favouriteActorIds, this.favouriteActorIds.length);
          axios
              .get(`https://api.themoviedb.org/3/person/${this.mostRepeatedActorId}/movie_credits?api_key=${storage.apiKey}&language=ru-RU`)
              .then((response) => {
                for (let i = 0; i < response.data.cast.length; i++) {
                  this.filmsIdsOfFavouriteActor.push(response.data.cast[i].id)
                }
                for (let i = 0; i < this.filmsIdsOfFavouriteActor.length; i++) {
                  axios
                      .get(`https://api.themoviedb.org/3/movie/${this.filmsIdsOfFavouriteActor[i]}?api_key=${storage.apiKey}&language=ru-RU`)
                      .then((response) => {
                        this.actorMovies.push(response.data);
                          this.actorMovies2 = this.actorMovies.slice(0, 20);
                          this.actorMovies2 = this.actorMovies
                        this.listLoaded = true;
                        if (this.type === "page") {
                          document.title = this.pageTitle;
                        }

                      })
                      .catch(
                          function (error) {
                            console.log(error);
                          }
                      );
                }
              });
        });
  },
  methods: {
    async getUserDetails() {
      const userId = JSON.parse(localStorage.getItem('user'))._id;
      // console.log(userId)
      await this.$http.get(`user/getUser/${userId}`)
          .then((response) => {
            this.user = response.data
            for (let film in this.user.favouriteFilms) {
              let filmId = this.user.favouriteFilms[film]
              // console.log(this.user)
              axios
                  .get(`https://api.themoviedb.org/3/movie/${filmId.filmId}?api_key=${storage.apiKey}&language=ru`)
                  .then((response) => {
                    this.arraysId.push(response.data)
                  });
            }
            // console.log(this.arraysId)
          });
    },

    //get more films
    loadMoreActorsFilms() {
      this.currentPage++;
      for (let i = 0; i < this.filmsIdsOfFavouriteActor.length; i++) {
        axios
            .get(`https://api.themoviedb.org/3/movie/${this.filmsIdsOfFavouriteActor[i]}?api_key=${storage.apiKey}&language=ru-RU&sort_by=created_at.desc&page=${this.currentPage}`)
            .then(function (resp) {
                  console.log(resp.data);
                  // console.log(resp.data);

                  if (this.actorMovies !== []) {

                    console.log('not empty');
                    // this.finalResult = this.actorMovies.filter(el => !this.actorMovies2.includes(el));
                    let result1 = this.actorMovies.filter(el => !this.actorMovies2.includes(el));
                    // console.log('cut init arr:');
                    // console.log(result1);
                    let result2 = result1.slice(0, 5);
                    // console.log('5 first elems from cut init arr:');
                    // console.log(result2);
                    this.finalResult = this.actorMovies2.concat(result2);
                    // console.log('final arr with 10 elements');
                    // console.log(this.finalResult);
                    this.actorMovies2 = this.finalResult;
                  }
                }.bind(this)
            )
            .catch(
                function (error) {
                  console.log(error);
                }
            );
      }
    },

    loadMoreGenreFilms() {
      this.currentPage++;
      axios
          .get(`https://api.themoviedb.org/3/discover/movie?api_key=${storage.apiKey}&with_genres=${this.mostRepeatedGenreId}&language=ru&page=${this.currentPage}`)
          .then(function (resp) {
                console.log(resp.data);
                let data = resp.data;
                let genreData = this.genreMovies.concat(data.results);
                this.genreMovies = genreData;
              }.bind(this)
          ).catch(
          function (error) {
            console.log(error);
          }
      );
    },

    logUserOut() {
      localStorage.removeItem("jwt");
      localStorage.clear();
      this.$router.push("/login");
      document.location.reload();
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
    //display: flex;
    //float:left;
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