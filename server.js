import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line

// Do not change code below this line

const handleDate = (req, res) => {
  const { date } = req.params;

  let parsedDate;
  if (!date) {
    parsedDate = new Date();
  } else if (/^\d+$/.test(date)) {
    parsedDate = new Date(Number(date));
  } else {
    parsedDate = new Date(date);
  }

  if (isNaN(parsedDate.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  res.json({ unix: parsedDate.getTime(), utc: parsedDate.toUTCString() });
};

app.get("/api", handleDate);
app.get("/api/:date", handleDate);

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
