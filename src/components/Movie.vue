<script src="../../server/index.js"></script>
<template>
  <section class="movie">
    <div class="movie__container" v-if="movieLoaded">
      <header class="movie__header" :class="{'movie__header--page': type=='page'}">
        <div class="movie__wrap movie__wrap--header" :class="{'movie__wrap--page': type=='page'}">
          <figure class="movie__poster">
            <img v-if="moviePosterSrc" class="movie__img" src="~assets/placeholder.png"
                 v-img="moviePosterSrc">
            <img v-if="!moviePosterSrc" class="movies-item__img is-loaded" src="~assets/no-image.png">
          </figure>

          <div class="movie__title">
            <h1 class="movie__title-text">
              {{ movie.title }}
              <span v-if="movie.tagline">{{ movie.tagline }}</span>

            </h1>
          </div>
        </div>
      </header>
      <div class="movie__main">
        <div class="movie__wrap movie__wrap--main" :class="{'movie__wrap--page': type === 'page'}">
          <div class="movie__actions" v-if="user">

            <star-rating
                class="movie__actions-link"
                :increment="0.01" :fixed-points="2"
                :rating="this.rating"
                @rating-selected="clickStarRating"
                @click="clickStarRating(clickStarRating)"
            />

            <div class="movie__actions-link" :class="{'active' : favorite === true}"
                 @click="addFilm(filmId)">
              <span class="movie__actions-text">Отметить как Избранное?</span>
            </div>

            <div class="movie__actions-link" :class="{'active' : favorite === true}"
                 @click="removeFilm(filmId)">
              <span class="movie__actions-text">Удалить из избранного?</span>
            </div>

            <!-- check if film is in favourite -->
            <!--            <div class="movie__actions-link" :class="{'active' : favorite === true}"-->
            <!--                 @click="isFilmInFavourite(id)">-->
            <!--              <span class="movie__actions-text">film`s id</span>-->
            <!--            </div>-->

          </div>
          <div class="movie__info">
            <div v-if="movie.overview" class="movie__description">
              {{ movie.overview }}
            </div>

            <div class="movie__details">
              <div v-if="movie.genres.length" class="movie__details-block">

                <h2 class="movie__details-title">
                  Жанры
                </h2>

                <div class="movie__details-text">
                  {{ nestedDataToString(movie.genres) }}
                </div>
              </div>

              <h2 class="movie__details-title">
                В главных ролях
              </h2>

              <div v-if="this.actorNames.length" class="actor__details-text">
                <div v-for="actor in this.actorNames.slice(0,10)" :key="actor"
                     class="movie__details-text">
                  {{ actor }}
                </div>
              </div>
            </div>

            <div v-if="movie.release_date" class="movie__details-block">
              <h2 class="movie__details-title">
                Дата выхода
              </h2>
              <div class="movie__details-text" v-formatDate="movie.release_date"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container mt-5">
        <div class="row">
          <h1 style="text-align: center; padding-top: 20px; margin-bottom: -10px;">Рекомендуемые фильмы по вашему самому
            популярному жанру </h1>
          <div class="col-md-12">
            <ul class="list-group">
              <ul class="movies__list">
                <movies-list-item class="movies__item" v-for="movie in this.finalGenresArr"
                                  :movie="movie "></movies-list-item>
              </ul>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <div class="container mt-5">
      <div class="row">
        <h1 style="text-align: center; padding-top: 20px; margin-bottom: -10px;">Рекомендованные фильмы
        </h1>
        <div class="col-md-12">
          <ul class="list-group">
            <ul class="movies__list">
              <movies-list-item class="movies__item" v-for="movie in this.recs" :movie="movie ">
              </movies-list-item>
            </ul>
          </ul>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import axios from 'axios'
import storage from '../storage.js'
import img from '../directives/v-image.js'
import formatDate from '../directives/v-formatDate.js'
import swal from "sweetalert"
import StarRating from "vue-star-rating";
import MoviesListItem from './MoviesListItem.vue'

export default {
  props: ['id', 'type'],
  components: {StarRating, MoviesListItem},
  directives: {
    img: img,
    formatDate: formatDate
  },
  data() {
    return {
      movie: {},
      movieLoaded: false,
      moviePosterSrc: '',
      movieBackdropSrc: '',

      actor: {},
      actorLoaded: false,
      actorPosterSrc: '',
      actorBackdropSrc: '',
      actorNames: [],

      favorite: '',
      user: '',
      filmId: this.id,
      recs: [],

      rating: this.rating,
      featuredUserFilms: [],
      featuredFilms: [],
      recommendedFeaturedFilms: [],
      outputRecommendedFeaturedFilms: [],

      featuredUserFilmsArr: [],
      featuredUserGenresArr: [],
      featuredUserGenresIds: [],
      firstGenresFilms: [],
      finalGenresArr: [],
      mostRepeatedGenreName: ''
    }
  },
  created() {
    this.fetchMovie(this.id);
    this.fetchActors(this.id);
    this.user = localStorage.getItem("jwt") ? true : false
  },
  computed: {},
  mounted() {
    axios.get(`https://api.themoviedb.org/3/movie/${this.filmId}/recommendations?api_key=${storage.apiKey}&language=ru`)
        .then((response => (this.recs = response.data.results)));

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
    axios.get(`http://localhost:4000/user/allUsers`)
        .then(response => {
          let users = response.data;
          for (let i = 0; i < users.length; i++) {
            if (`"${this.users[i].name}"` === localStorage.userName) {
              for (let j = 0; j < this.users[i].featuredFilms.length; j++) {
                this.featuredUserFilms.push(this.users[i].featuredFilms[j].filmId);
              }
            } else {
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

          console.log(this.recommendedFeaturedFilms);

          for (let i = 0; i < this.recommendedFeaturedFilms.length; i++) {
            // console.log(this.recommendedFeaturedFilms[i]);
            axios
                .get(`https://api.themoviedb.org/3/movie/${this.recommendedFeaturedFilms[i]}?api_key=${storage.apiKey}&language=ru`)
                .then((response) => {
                  this.outputRecommendedFeaturedFilms.push(response.data);
                });
          }
          // console.log(this.outputRecommendedFeaturedFilms);
        });

    //first - get an array of genres from featuredUsersFilms
    //final - get ONE genre from array, which occurs most often
    axios.get(`http://localhost:4000/user/allUsers`)
        .then(response => {
          // console.log('Featured users films array of genres:');
          // console.log(this.featuredUserFilms);
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

                  //find the most repeated value
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

                  let mostRepeated = mostFrequent(this.featuredUserGenresIds, this.featuredUserGenresIds.length);
                  console.log('The most popular user`s genre Id: ' + mostRepeated);

                  // axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${storage.apiKey}&language=ru-RU`)
                  //     .then(response => {
                  //       console.log(response.data);
                  //       for (let i = 0; i < response.data.length; i++) {
                  //         for(let j = 0;)
                  //         console.log(response.data[i]);
                  //       }
                  //     });

                  axios
                      .get(`https://api.themoviedb.org/3/discover/movie?api_key=${storage.apiKey}&with_genres=${mostRepeated}&language=ru`)
                      .then((response) => {
                        this.firstGenresFilms.push(response.data.results);
                        for (let i = 0; i < this.firstGenresFilms.length; i++) {
                          this.finalGenresArr = this.firstGenresFilms[0];
                        }
                        // console.log(this.finalGenresArr);
                      });
                });
          }

        });
  },
  methods: {
    //add film to the db (pass film`s id)
    async addFilm(filmId) {
      try {
        console.log(filmId);
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        await this.$http.put(`/user/addFilm/${filmId}`, {
          id: userId,
          favouriteFilms: this.filmId
        })
            .then(response => {
              console.log(response)
            })
        swal("Ура!", "\n" + "Фильм был успешно добавлен в избранное.", "success");
        this.$router.push("/profile");
      } catch (err) {
        let error = err.response;
        console.log(error);
      }
    },

    //get film rating
    async clickStarRating(rating) {
      try {
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        const filmId = this.id;
        this.rating = rating;
        console.log(userId);
        console.log(filmId);
        console.log(rating);

        if (this.rating >= 4) {
          await this.$http.put(`/user/clickStarRating/${filmId}/${rating}`, {
            filmRating: this.rating,
            filmId: this.filmId,
            userId
          })
              .then(response => {
                console.log(response.data)
              });

          await this.$http.put(`/user/addFeaturedFilm/${filmId}/${rating}`, {
            filmRating: this.rating,
            filmId: this.filmId,
            userId
          }).then(response => {
            console.log(response.data)
          });

          await swal("Ура!", "\n" + "Рейтинг был успешно поставлен фильму.", "success");
        } else {
          await this.$http.put(`/user/clickStarRating/${filmId}/${rating}`, {
            filmRating: this.rating,
            filmId: this.filmId,
            userId
          })
              .then(response => {
                console.log(response.data)
              });
          await swal("Ура!", "\n" + "Рейтинг был успешно поставлен фильму.", "success");
        }
      } catch (err) {
        let error = err.response;
        console.log(error);
      }
    }
    ,

    //remove film from favourite
    async removeFilm(filmId) {
      try {
        console.log(filmId);
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        await this.$http.delete(`/user/removeFilm/${filmId}`, {
          data: {
            id: userId,
            favouriteFilms: filmId
          }
        })
            .then(response => {
              console.log(response)
            })
        swal("Ура!", "\n" + "Фильм был успешно удален из избранных!.", "success");
        this.$router.push("/profile");
      } catch (err) {
        let error = err.response;
        console.log(error);
      }
    },

    // check if film is in favourite
    isFilmInFavourite(filmId) {
      let favouriteFilmId = JSON.parse(localStorage.getItem('user')).favouriteFilms;

      console.log(`Film's id: ${filmId}`);

      for (let i = 0; i < favouriteFilmId.length; i++) {
        console.log(`All favourite film's ids: ${favouriteFilmId[i].film}`);
        if (favouriteFilmId[i].film.includes(filmId)) {
          console.log('Includes');
        } else {
          console.log('Not Includes');
        }
      }
    }
    ,

    //output movie
    fetchMovie(id) {
      axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${storage.apiKey}&language=ru`)
          .then(function (resp) {
            let movie = resp.data;
            this.movie = movie;
            this.poster();
            this.movieBackdrop();
            this.movieLoaded = true;
            // Change Page title
            document.title = this.movie.title;
          }.bind(this))
          .catch(function (error) {
            this.$router.push({name: 'home-category'});
          }.bind(this));
    }
    ,

    //output actors
    fetchActors(id) {
      axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${storage.apiKey}&language=ru`)
          .then(function (resp) {
            let actor = resp.data.cast;
            for (let i = 0; i < actor.length; i++) {
              if (actor[i].known_for_department === "Acting") {
                this.actorNames.push(actor[i].name);
              }
            }
            this.actor.cast = actor;
            this.photo();
            this.actorBackdrop();
          }.bind(this))
          .catch(function (error) {
            this.$router.push({name: 'home-category'});
          }.bind(this));
    },
    poster() {
      if (this.movie.poster_path) {
        this.moviePosterSrc = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + this.movie.poster_path;
      }
    }
    ,
    photo() {
      if (this.actor.profile_path) {
        this.actorPosterSrc = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + this.actor.profile_path;
        console.log(this.actorPosterSrc);
      }
    }
    ,
    movieBackdrop() {
      if (this.movie.backdrop_path) {
        this.movieBackdropSrc = 'https://image.tmdb.org/t/p/w500' + this.movie.backdrop_path;
      }
    }
    ,
    actorBackdrop() {
      if (this.actor.profile_path) {
        this.actorBackdropSrc = 'https://image.tmdb.org/t/p/w500' + this.movie.profile_path;
      }
    }
    ,
    nestedDataToString(data) {
      let nestedArray = [], resultString;
      data.forEach((item) => nestedArray.push(item.name));
      resultString = nestedArray.join(', ');
      return resultString;
    }
  }
  ,
  watch: {
    id: function (val) {
      this.fetchMovie(val);
    }
    ,
    actorsId: function (val) {
      this.fetchActors(val);
    }
  }
}

</script>

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";

.movie {
  &__wrap {
    display: flex;

    &--page {
      max-width: 768px;
      position: relative;
      margin: 0 auto;
    }

    &--header {
      align-items: center;
      height: 100%;
    }

    &--main {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      @include tablet-min {
        flex-direction: row;
      }
    }
  }

  &__header {
    height: 250px;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-color: $c-dark;
    @include tablet-min {
      height: 350px;
      &--page {
        height: 384px;
      }
    }

    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      background: rgba($c-dark, 0.85);
    }
  }

  &__poster {
    display: none;
    @include tablet-min {
      background: $c-dark;
      display: block;
      position: absolute;
      width: calc(45% - 40px);
      top: 40px;
      left: 40px;
    }
  }

  &__img {
    display: block;
    width: 100%;
    opacity: 0;
    transform: scale(0.97) translateZ(0);
    transition: opacity 0.5s ease, transform 0.5s ease;

    &.is-loaded {
      opacity: 1;
      transform: scale(1);
    }
  }

  &__title {
    position: relative;
    padding: 20px;
    color: $c-green;
    text-align: center;
    width: 100%;
    @include tablet-min {
      width: 55%;
      text-align: left;
      margin-left: 45%;
      padding: 30px 30px 30px 40px;
    }

    &-text {
      font-weight: 500;
      line-height: 1.4;
      font-size: 24px;
      @include tablet-min {
        font-size: 30px;
      }

      span {
        display: block;
        font-size: 14px;
        font-weight: 300;
        color: rgba($c-white, 0.7);
        margin-top: 10px;
      }
    }
  }

  &__main {
    background: $c-light;
    min-height: calc(100vh - 250px);
    @include tablet-min {
      min-height: 0;
    }
  }

  &__actions {
    text-align: center;
    width: 100%;
    order: 2;
    padding: 20px;
    border-top: 1px solid rgba($c-dark, 0.05);
    @include tablet-min {
      order: 1;
      width: 45%;
      padding: 185px 0 40px 40px;
      border-top: 0;
    }

    &-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      text-transform: uppercase;
      color: rgba($c-dark, 0.5);
      transition: color 0.5s ease;
      font-size: 11px;
      padding: 10px 0;
      border-bottom: 1px solid rgba($c-dark, 0.05);

      &:hover {
        color: rgba($c-dark, 0.75);
      }

      &.active {
        color: $c-dark;
      }
    }

    &-icon {
      width: 16px;
      height: 16px;
      margin: 0 10px 0 0;
      fill: rgba($c-dark, 0.5);
      transition: fill 0.5s ease, transform 0.5s ease;

      &.waiting {
        transform: scale(0.8, 0.8);
      }
    }

    &-link:hover &-icon {
      fill: rgba($c-dark, 0.75);
    }

    &-link.active &-icon {
      fill: $c-green;
    }

    &-text {
      display: block;
      padding-top: 2px;
    }
  }

  &__info {
    width: 100%;
    padding: 20px;
    order: 1;
    @include tablet-min {
      order: 2;
      padding: 40px;
      width: 55%;
      margin-left: 45%;
    }
  }

  &__actions + &__info {
    margin-left: 0;
  }

  &__description {
    font-weight: 300;
    font-size: 13px;
    line-height: 1.8;
    margin-bottom: 20px;
    @include tablet-min {
      margin-bottom: 30px;
      font-size: 14px;
    }
  }

  &__details {
    &-block:not(:last-child) {
      margin-bottom: 20px;
      @include tablet-min {
        margin-bottom: 30px;
      }
    }

    &-title {
      margin: 0;
      font-weight: 400;
      text-transform: uppercase;
      font-size: 14px;
      color: $c-green;
      @include tablet-min {
        font-size: 16px;
      }
    }

    &-text {
      font-weight: 300;
      font-size: 14px;
      margin-top: 5px;
    }
  }

  .actor__details-text {
    /*color: red;*/
    padding-top: 5px;
    padding-bottom: 25px;
    font-weight: 300;
    font-size: 14px;
  }

  @media (min-width: 768px) {
    .movie__actions {
      order: 1;
      width: 45%;
      padding: 130px 0px 40px 50px;
      border-top: 0;
    }
  }
}
</style>
