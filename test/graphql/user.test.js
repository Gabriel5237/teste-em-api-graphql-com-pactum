// test.js
const { spec } = require('pactum');
const { eachLike, like } = require('pactum-matchers');

let token;
beforeEach(async () => {
      const response = await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withGraphQLQuery(`
     mutation AuthUser($email: String, $password: String) {
     authUser(email: $email, password: $password) {
     success
     token
    }
  }
  `)
        .withGraphQLVariables({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        token = response.body.data.authUser.token;
});
it('listagem de usuarios', async () => {
    await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withHeaders('Authorization', token)
        .withGraphQLQuery(`
    query {
       Users {
       id
       email
       profile {
       firstName
        }
      }
    }
  `)
        .expectStatus(200)
        .expectJsonMatch({
            data: {
                Users: eachLike ({
                    id: like("679f9c440cf0a913258b289d"),
                    email: like("peitester@ebac.com"),
                })
            }
        })

});
