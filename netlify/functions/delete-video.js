export const handler = async (event) => {
    try {
      const { id } = JSON.parse(event.body);
  
      if (!id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing submission ID" }),
        };
      }
  
      const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;
      const siteId = process.env.MY_SITE_ID; // Ensure SITE_ID is stored in Netlify Environment Variables
  
      const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/submissions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: "Failed to delete video" }),
        };
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } catch (error) {
      console.error("Error deleting video:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  };
  