import { jwtVerify } from "jose";

const validToken = async (token) => {
  const SECRET = import.meta.env.VITE_SECRET_KEY;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET),
    );
    return payload;
  } catch (error) {
    return false;
  }
};

export default validToken;
