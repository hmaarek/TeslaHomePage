const fetch = require('node-fetch');

exports.handler = async () => {
  const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;
  const SITE_ID = process.env.MY_SITE_ID;

  const response = await fetch(`https://api.netlify.com/api/v1/forms?access_token=${NETLIFY_AUTH_TOKEN}`);
  const forms = await response.json();

  const videoForm = forms.find(form => form.name === 'video-form');
  if (!videoForm) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Form not found' }),
    };
  }

  const submissionsResponse = await fetch(
    `https://api.netlify.com/api/v1/forms/${videoForm.id}/submissions?access_token=${NETLIFY_AUTH_TOKEN}`
  );
  const submissions = await submissionsResponse.json();

  return {
    statusCode: 200,
    body: JSON.stringify(submissions),
  };
};
