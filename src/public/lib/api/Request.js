const Request = (method, data) => {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  return config;
};

module.exports = Request;
