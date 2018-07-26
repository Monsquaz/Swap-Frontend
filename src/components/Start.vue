<template>
  <div>
    <hero
      title="Welcome to Monsquaz Swap!"
      subtitle="A collaborative project management system that can yield fantastic, unexpected results"></hero>
    <div class="columns is-centered">
      <section class="content-box column is-two-thirds">
        <div>
          <h3>Relay writing generalized and improved</h3>
          <p>We came up with a fun idea in 2011. That a few people would come together and start composing one song each,
          based on the same set of sound samples.
          Each person would then swap their song for a different one and continue working on it,
          until everyone had contributed to everyone else's song - and we'd end up with an album.</p>
          <h3>Randomized swaps</h3>
          <p>In relay writing, you'd usually sit in a circle and pass your work along to the right. This means that when there's a new round,
          it's always the same person who would have worked on your story right before you. This is a big creativity issue,
          since the same person would have to interpret the same person's last work for all of the stories.</p>
          <p>Instead, we generate swapping schedules as random <a target="_blank" href="https://en.wikipedia.org/wiki/Latin_square">Latin Squares</a> in this fashion;</p>
            <swap-schedule :schedule="swapSchedule" />
            <div class="sub-label">
              Example schedule.<br />
              Song {{ exampleSongIndex + 1 }} gets passed through
              {{ swapSchedule.map(round => round[exampleSongIndex].title).slice(0, -1).join(' &rarr; ') }}
                and is finnished by
                {{ swapSchedule[swapSchedule.length - 1][exampleSongIndex].title }}
            </div>
          <h3>Anonymous</h3>
          <p>To spice things up further, the schedule will be hidden from participants</p>
          <h3>Annual Monsquaz Swap</h3>
          <p>Our initial series of events will be hosted annually. <i>If you appreciate this service, we ask you not for donations,
            but for your participation in one of these events.</i> Musical skill is not required.
            Some of the more interesting pieces will emerge as a result of experienced composers working on inexperiences composers' work.
          </p>
          <div style="text-align: center; margin-top: 15px;">
            <iframe class="youtube" width="560" height="315" src="https://www.youtube.com/embed/e-PYALxcdrM?start=32" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            <div class="sub-label">Video from our latest annual event</div>
          </div>
          <h3>Not just for music!</h3>
          <p>We made this service to simplify the work involved for hosting our own events like this,
            but we're also making it available for you to use for events of your own - with other kinds of files.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import { getRandomLatinSquare } from 'jacobson-matthews-latin-square-js';
  let people = [ 'Alice', 'George', 'Eric', 'Fred', 'Matt', 'Monica'];
  let square = getRandomLatinSquare(people.length);
  let exampleSongIndex = Math.floor(Math.random() * people.length );
  for (let x in square) for (let y in square) square[x][y] = {
    title: people[square[x][y]]
  };
  module.exports = {
    name: 'start',
    data: () => ({
      swapSchedule: square,
      exampleSongIndex
    }),
    metaInfo: () => ({
      title: () => 'Start',
      meta: [{
        name: 'description',
        content: 'Welcome to Monsquaz Swap!' +
          ' A collaborative project management system that can yield fantastic, unexpected results'
      }]
    })
  };
</script>

<style lang="sass" scoped>
  .sub-label {
    text-align: center;
    font-style: italic;
    font-size: 0.9em;
  }
  .youtube {
    max-width: 100%;
  }
</style>
