<template>
  <div>
    <hero
      title="Privacy Policy"
      subtitle="Because there needs to be one"></hero>
    <div class="columns is-centered">
      <section class="content-box column is-three-quarters">
        <div>
          <div class="content">
            <h3>Registration</h3>
            <p>During registration, the following data will be saved to our database about you</p>
            <ul>
              <li>email</li>
              <li>username</li>
              <li>firstname</li>
              <li>lastname</li>
              <li>hashed password</li>
              <li>random activation code</li>
            </ul>
            All fields are mandatory to fill in, but you may enter faked names if you desire.
            <h3>Authentication</h3>
            <p>During authentication, username and password will be transmitted over
              SSL and checked against the username and password hash we have stored</p>
            <p>Upon success, an authToken in the form of a <a href="https://en.wikipedia.org/wiki/JSON_Web_Token" target="_blank">JWT</a> will be retreived and stored
              using localStorage in your browser. It can be thought of as a session cookie.</p>
            <h3>Email policy</h3>
            <p>When participating in events, automatic notifications will be sent to your email that are relevant for your participation,
            such as whether the event has started or ended. The email addresses are not exposed to other users</p>
            <h3>Service usage</h3>
            <p>Data about you will be saved when interacting with the service in several ways</p>
            <p>Event administration, Event participation, event invitation, what you submitted during a
              roundsubmission or whether you skipped it, or filled in for it, and comments will all be saved.
              It is considered a core feature of the service for other users to see at a later time who participated in what event, and how they contributed.</p>
            <h3>Right to be forgotten</h3>
            <p>If a user of the service so wishes, he/she may contact us via email with a request to be forgotten.
              Such a request will have us inactivate the user account and scramble the credentials.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  module.exports = {
    name: 'privacy-policy',
    props: {},
    data: () => ({}),
    metaInfo: () => ({
      title: () => 'Privacy policy', // TODO: event.name!
      meta: [{
        name: 'description',
        content: 'Basically, we\'ll keep your activity but may randomize it if requested.'
      }]
    })
  };
</script>

<style lang="sass" scoped>
  .hero {
    margin-top: 40px;
  }
</style>
