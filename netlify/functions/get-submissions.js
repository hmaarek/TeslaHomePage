export const handler = async () => {

// Debugging: Check if the token is available
//console.log('Auth Token Available:', !!process.env.NETLIFY_AUTH_TOKEN);

  const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;
  const SITE_ID = process.env.MY_SITE_ID; // Ensure this is set in Netlify env variables

//console.log('Auth Token:', NETLIFY_AUTH_TOKEN);

  try {
//    console.log('Fetching forms...');
    //const response = await fetch('https://api.netlify.com/api/v1/forms', {
    //const response = await fetch('https://api.netlify.com/api/v1/sites/aafb893c-fa27-4d61-b09c-b6a8301dbcd1/forms', {
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/forms`,{
  
      headers: {
        Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
      },
    });

    // Log raw response for debugging
    const rawText = await response.text();
    //console.log('Raw Response:', rawText);

    if (!response.ok) {
      console.error('Failed to fetch forms:', rawText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch forms' }),
      };
    }

    // Parse the response JSON if successful
    const forms = JSON.parse(rawText);
    //console.log('Forms fetched:', forms);

    // Find the form named "video-form"
    const videoForm = forms.find(form => form.name === 'video-form');
    if (!videoForm) {
      console.error('Form not found');
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Form not found' }),
      };
    }

    //console.log('Fetching submissions...');
    const submissionsResponse = await fetch(
      `https://api.netlify.com/api/v1/forms/${videoForm.id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
        },
      }
    );

    const submissionsRaw = await submissionsResponse.text();
    //console.log('Submissions Raw Response:', submissionsRaw);

    if (!submissionsResponse.ok) {
      console.error('Failed to fetch submissions:', submissionsRaw);
      return {
        statusCode: submissionsResponse.status,
        body: JSON.stringify({ error: 'Failed to fetch submissions' }),
      };
    }

    const submissions = JSON.parse(submissionsRaw);
    //console.log('Submissions fetched:', submissions);

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
