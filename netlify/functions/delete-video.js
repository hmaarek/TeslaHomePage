export const handler = async (event) => {
    try {
      console.log("Received request body:", event.body);
  
      // Parse request body
      const requestBody = JSON.parse(event.body);
      const { id } = requestBody;
  
      if (!id) {
        console.error("Missing submission ID");
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing submission ID" }),
        };
      }
  
      const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;
      const SITE_ID = process.env.MY_SITE_ID; // Ensure this is set in Netlify env variables
  
      const response = await fetch(
        `https://api.netlify.com/api/v1/sites/${SITE_ID}/submissions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        console.error("Failed to delete:", await response.text());
        console.error("Fid failed: ", id);
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: "Failed to delete video" }),
        };
      }
  
      console.log(`Successfully deleted submission: ${id}`);
  
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
  