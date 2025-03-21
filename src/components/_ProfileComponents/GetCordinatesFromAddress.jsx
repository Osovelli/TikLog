import axios from "axios";

const getCoordinatesFromAddress = async (address, apiKey) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );

    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error(response.data.status);
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

export default getCoordinatesFromAddress;