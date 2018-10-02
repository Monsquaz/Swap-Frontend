<template>
  <div>
    <hero
      title="Related links"
      subtitle="If you enjoy this service, you may be interested in these"></hero>
    <div class="columns is-centered">
      <section class="content-box column is-three-quarters">
        <ul>
          <li class="link-section" v-for="section in linkSections">
            <div class="section-title">{{ section.title }}</div>
            <table class="table">
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
              <tr v-for="link in section.links">
                <td>
                  <a :href="link.href" target="_blank">
                    {{ link.title }}
                  </a>
                </td>
                <td>
                  {{ link.description }}
                </td>
              </tr>
            </table>
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
              description: 'html5 recreation of the original monsquaz animation (NSFW)'
            },
            {
              href: 'http://www.monsquaz.com',
              title: 'Monsquaz Select',
              description: 'Fan site by 42/11'
            },
            {
              href: 'https://soundcloud.com/monsquaz-swap-project',
              title: 'Monsquaz on Soundcloud',
              description: 'The official swap songs'
            },
            {
              href: 'https://www.youtube.com/channel/UCS4KPOafRhqkTdbpoGJrSOQ',
              title: 'Monsquaz on Youtube',
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
            },
            {
              href: 'irc://irc.esper.net:6667/monsquaz',
              title: 'Monsquaz on IRC',
              description: 'Come and chat with us through IRC'
            },
            {
              href: 'https://discord.gg/qvKWjKv',
              title: 'Monsquaz on Discord',
              description: 'Come and chat with us through Discord'
            },
          ]
        },
        {
          title: 'Music compos',
          links: [
            {
              href: 'http://compo.thasauce.net',
              title: 'ThaSauce',
              description: 'Various musical compos. Including the weekly OHC.'
            },
            {
              href: 'http://battleofthebits.org/',
              title: 'Battle of the bits',
              description: 'Chiptune compos'
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
</style>
