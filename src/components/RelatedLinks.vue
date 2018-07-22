<template>
  <div>
    <hero
      title="Related links"
      subtitle="If you enjoy this service, you may be interested in these"></hero>
    <div class="columns is-mobile is-centered">
      <section class="content-box column is-two-thirds">
        <ul>
          <li class="link-section" v-for="section in linkSections">
            <div class="section-title">{{ section.title }}</div>
            <ul>
              <li class="link-block" v-for="link in section.links">
                <a class="link" target="_blank" v-bind:href="link.href">{{ link.title }}</a>
                <p class="link-description">{{ link.description }}</p>
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
  module.exports = {
    name: 'related-links',
    props: {},
    metaInfo: () => ({
      title: () => 'Related links',
      meta: [{
        name: 'description',
        content: 'Links to other websites. You know, like people used to do.'
      }]
    }),
    data: () => ({
      linkSections: [
        {
          title: 'Monsquaz',
          links: [
            {
              href: 'http://www.monsquaz.org',
              title: 'The animation',
              description: 'html5 recreation of the original monsquaz animation'
            },
            {
              href: 'http://www.monsquaz.com',
              title: 'Monsquaz select',
              description: 'Fan site by 42/11'
            },
            {
              href: 'https://soundcloud.com/monsquaz-swap-project',
              title: 'Monsquaz on Soundcloud',
              description: 'The official swap songs'
            },
            {
              href: 'https://www.youtube.com/channel/UCS4KPOafRhqkTdbpoGJrSOQ',
              title: 'Monsquaz on youtube',
              description: 'A channel by and for community members'
            },
            {
              href: 'https://www.facebook.com/Monsquaz',
              title: 'Monsquaz on Facebook',
              description: 'A page by and for community members'
            },
            {
              href: 'https://github.com/Monsquaz',
              title: 'Monsquaz on Github',
              description: 'Monsquaz related code repositories. This website\'s source is on there.'
            },
            {
              href: 'https://www.instagram.com/monsquaz/',
              title: 'Monsquaz on Instagram',
              description: 'Will eventually contain images?'
            }
          ]
        },
        {
          title: 'Music compos',
          links: [
            {
              href: 'http://compo.thasauce.net',
              title: 'ThaSauce',
              description: 'Various musical compos. Including the weekly OHC.'
            }
          ]
        },
        {
          title: 'dusthillguy',
          links: [
            {
              href: 'http://dusthillguy.ddns.net/',
              title: 'Patrick M\'s webserver',
              description: 'Oh yeah. It\'s dusthillguy'
            }
          ]
        }
      ]
    }),
  };
</script>

<style lang="sass" scoped>
  .link-section:not(:first-of-type) {
    .section-title {
      padding-top: 25px;
    }
  }
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    border-bottom: 1px solid #c0c0c0;
    clear: both;
  }
  .link-block {
    padding: 5px;
    width: calc(50% - 2px);
    margin-top: 5px;
    float: left;
    &:nth-child(2n+1) {
      clear: both;
    }
  }
    @media screen and (max-width: 767px) {
      .link-block {
        width: 100%
      }
    }
  .link {
    font-weight: bold;
    font-size: 1.5em;
  }
  .link-description {}
</style>
