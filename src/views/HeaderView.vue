<template>
  <div class="header">
    <img src="../assets/logo.png" />
    <p><a href="javascript:location.reload()">Note Knock</a></p>
    <div class="weatherNote" v-if="view">
      <div>
        <span><img :src="imgURL" /></span>
        <div class="local">
          <span>{{ country }}</span>
          <span>{{ city }}</span>
          <span>{{ weather[0].description }}</span>
        </div>
      </div>
      <div class="temperature">
        <span>현재온도&nbsp;{{ temp.toFixed(2) }}º</span>
        <span>체감온도&nbsp;{{ feels_like.toFixed(2) }}º</span>
      </div>
    </div>
    <p class="sub-title" style="font-size: 70px; margin: 0px;">낰낰</p>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import axios from "axios";

export default {
  data() {
    return {
      view: false,
      imgUrl: null,
      country: "",
      city: "",
      weather: "",
      temp: "",
      feels_like: "",
      lat: "",
      lon: "",
    };
  },
  mounted() {
    setTimeout(this.getMap, 12000);
    setTimeout(this.searchWeather, 13000);
  },
  methods: {
    getMap() {
      if (navigator.geolocation) {
        var self = this;
        navigator.geolocation.getCurrentPosition(function (position) {
          (self.lat = position.coords.latitude), // 위도
            (self.lon = position.coords.longitude); // 경도
        });
      }
    },
    searchWeather() {
      const BASE_URL = `http://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&lang=kr&appid=95e8423951820d94ae0f14e1d78c5f86`;

      axios
        .get(BASE_URL)
        .then((res) => {
          this.country = res.data.sys.country;
          this.city = res.data.name;
          this.temp = res.data.main.temp - 273.15;
          this.feels_like = res.data.main.feels_like - 273.15;
          this.weather = res.data.weather;
          this.imgURL =
            "http://openweathermap.org/img/w/" + this.weather[0].icon + ".png";

          this.view = true;

          var header = document.getElementsByClassName("header");
          if (this.weather[0].description === "튼구름") {
            for (var i = 0; i < header.length; i++) {
              header[i].style["background-color"] = "#BDBDBD";
            }
          } else if (this.weather[0].description === "구름조금") {
            for (var j = 0; j < header.length; j++) {
              header[j].style["background-color"] = "#E6E6E6";
            }
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style></style>
