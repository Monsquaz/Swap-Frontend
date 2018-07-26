<template>
  <footer class="footer">
    <div class="container">
      <div class="columns">
        <div class="column is-3 left">
          <ul>
            <li>
              IRC: <a href="irc://irc.esper.net:6667/monsquaz">#monsquaz @ irc.esper.net</a>
            </li>
            <li>Discord: <a href="https://discord.gg/qvKWjKv">https://discord.gg/qvKWjKv</a></li>
            <li>Email: <a href="mailto:info@monsquaz.org">info@monsquaz.org</a></li>
          </ul>
        </div>
        <div class="column is-6 content has-text-centered center">
          <div class="scrolling">
            You need more Monsquaz!
          </div>
          <div class="copyright">
            Copyright &copy; 2005 - {{ (new Date()).getFullYear() }} Monsquaz Foundation, all rights reserved.
          </div>
          <div class="social">
            <a href="https://soundcloud.com/monsquaz-swap-project" title="Soundcloud" target="_blank">
              <icon name="brands/soundcloud" scale="3"></icon>
            </a>
            <a href="https://www.youtube.com/channel/UCS4KPOafRhqkTdbpoGJrSOQ" title="Youtube" target="_blank">
              <icon name="brands/youtube-square" scale="3"></icon>
            </a>
            <a href="https://www.facebook.com/Monsquaz" title="Facebook" target="_blank">
              <icon name="brands/facebook-square" scale="3"></icon>
            </a>
            <a href="https://github.com/Monsquaz" title="Github" target="_blank">
              <icon name="brands/github-square" scale="3"></icon>
            </a>
            <a href="https://www.instagram.com/monsquaz/" title="Instagram" target="_blank">
              <icon name="brands/instagram" scale="3"></icon>
            </a>
          </div>
        </div>
        <div class="column is-3 right">
          <ul>
            <li>
              <router-link to="/privacy-policy">Privacy policy</router-link>
            </li>
            <li>
              <router-link to="/disclaimer">Disclaimer</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import 'vue-awesome/icons/brands/soundcloud';
import 'vue-awesome/icons/brands/youtube-square';
import 'vue-awesome/icons/brands/facebook-square';
import 'vue-awesome/icons/brands/github-square';
import 'vue-awesome/icons/brands/instagram';
module.exports = {
  name: 'monsquaz-footer'
};
</script>

<style lang="sass" scoped>
  a {
    color: #8888ff;
    text-shadow: #000000 1px 1px 0;
  }
  .scrolling {
     animation: marquee 5s ease-in-out infinite;
     height: 27px;
     overflow: hidden;
     white-space: nowrap;
     font-size: 18px;
  }
  .copyright {
    margin-top: 10px;
    font-size: 12px;
  }
  .social {
    margin-top: 15px;

    a {
      color: #ffffff;
      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
  @keyframes marquee {
    0%   { text-indent: 250px }
    50% { text-indent: -250px }
    100%   { text-indent: 250px }
  }
  .right {
    text-align: right;
  }
</style>
