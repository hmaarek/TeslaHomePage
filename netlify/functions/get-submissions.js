import fetch from 'node-fetch';

export const handler = async () => {
  const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;

  try {
    console.log('Starting Netlify Function...');
    
    // Fetch forms from Netlify
    const response = await fetch(`https://api.netlify.com/api/v1/forms`, {
      headers: {
        Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch forms:', await response.text());
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch forms' }),
      };
    }

    const forms = await response.json();
    console.log('Fetched forms:', forms);

    // Find the "video-form"
    const videoForm = forms.find(form => form.name === 'video-form');
    if (!videoForm) {
      console.error('Form not found');
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Form not found' }),
      };
    }

    // Fetch submissions
    const submissionsResponse = await fetch(
      `https://api.netlify.com/api/v1/forms/${videoForm.id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
        },
      }
    );

    if (!submissionsResponse.ok) {
      console.error('Failed to fetch submissions:', await submissionsResponse.text());
      return {
        statusCode: submissionsResponse.status,
        body: JSON.stringify({ error: 'Failed to fetch submissions' }),
      };
    }

    const submissions = await submissionsResponse.json();
    console.log('Fetched submissions:', submissions);

    // Return submissions
    return {
      statusCode: 200,
      body: JSON.stringify(submissions),
    };
  } catch (error) {
    console.error('Uncaught error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
