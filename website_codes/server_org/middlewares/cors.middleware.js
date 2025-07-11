import cors from "cors";

const corsOptions = {
  origin: "https://connectco-frontend.onrender.com",
  credentials: true
};

export default cors(corsOptions);