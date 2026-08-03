const { reporter, flow, handler, mock } = require('pactum');
const { like } = require('pactum-matchers');
const pf = require('pactum-flow-plugin');

function addFlowReporter() {
  pf.config.url = 'http://localhost:8080'; // pactum flow server url
  pf.config.projectId = 'lojaebac-front';
  pf.config.projectName = 'Loja EBAC Front';
  pf.config.version = '1.0.3';
  pf.config.username = 'scanner';
  pf.config.password = 'scanner';
  reporter.add(pf.reporter);
}

// global before
before(async () => {
  addFlowReporter();
  await mock.start(4000);
});

// global after
after(async () => {
  await mock.stop();
  await reporter.end();
});

handler.addInteractionHandler('Login Response', () => {
return {
  provider: 'Login-api',
  flow: 'Login',

  request: {
    method: 'POST',
    path: '/public/authUser',
    body: {
      email: 'admin@admin.com',
      password: 'admin123'
    }
  },

  response: {
    status: 200,
    body: {      
      success: true,
      message: 'login successfully',
      data: {
        _id: '679f50eb0cf0a913258b286c',
        role: 'admin',
        profile: {
          firstName: 'admin'
        },
        email: 'admin@admin.com',
        token: like('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
      }
    }
  }
}
})

it('FRONT - deve autenticar o usuario corretamente', async () => {
  await flow("Login")
    .useInteraction('Login Response')
    .post('http://localhost:4000/public/authUser')
    .withJson({
      "email": "admin@admin.com",
      "password": "admin123"
    })
    .expectStatus(200)
    .expectJson('success', true)

});
