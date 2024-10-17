import app from "./app";

const port = process.env.PORT || 3000;

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
