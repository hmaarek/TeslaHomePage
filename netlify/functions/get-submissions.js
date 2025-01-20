//const fetch = require('node-fetch');
import fetch from 'node-fetch';

exports.handler = async () => {
  const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;

  try {
    // Fetch all forms from Netlify
    const response = await fetch(`https://api.netlify.com/api/v1/forms`, {
      headers: {
        Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
      },
    });

    const forms = await response.json();

    // Find the form named "video-form"
    const videoForm = forms.find(form => form.name === 'video-form');
    if (!videoForm) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Form not found' }),
      };
    }

    // Fetch submissions for the form
    const submissionsResponse = await fetch(
      `https://api.netlify.com/api/v1/forms/${videoForm.id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
        },
      }
    );
    const submissions = await submissionsResponse.json();

    // Return the submissions as JSON
    return {
      statusCode: 200,
      body: JSON.stringify(submissions),
    };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch submissions' }),
    };
  }
};
