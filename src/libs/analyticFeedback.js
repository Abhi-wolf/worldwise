const apiKEY = import.meta.env.VITE_OPEN_ANALYTICS_API_KEY;
const apiURL = import.meta.env.VITE_OPEN_ANALYTICS_URL;

export async function sendEvent(event) {
  console.log("event", event);

  try {
    const response = await fetch(`${apiURL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKEY}`, // Use the API key
      },
      body: JSON.stringify(event), // Convert event data to JSON string
    });

    console.log("RESPONSE = ", response);

    const result = await response.json();

    console.log("result = ", result);

    return result;
  } catch (error) {
    console.error("Error during request:", error.message);
  }
}

export async function sendFeedback(data) {
  console.log("feedback", data);

  try {
    const response = await fetch(`${apiURL}/feedbacks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKEY}`,
      },
      body: JSON.stringify(data),
    });

    console.log("RESPONSE = ", response);

    const result = await response.json();

    console.log("result = ", result);

    return result;
  } catch (error) {
    console.error("Error during request:", error.message);
  }
}
