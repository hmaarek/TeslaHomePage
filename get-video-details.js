export const handler = async (event) => {
    try {
      const { videoId } = event.queryStringParameters;
      if (!videoId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing video ID" }),
        };
      }
  
      const apiKey = process.env.YOUTUBE_API_KEY; // Securely fetch from Netlify environment variables
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
  
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (error) {
      console.error("Error fetching video details:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  };
  