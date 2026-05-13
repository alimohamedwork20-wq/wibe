const NotFound = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "10rem", fontWeight: "100", margin: 0 }}>404</h1>
      <p style={{ letterSpacing: "10px", textTransform: "uppercase" }}>
        Page Not Found
      </p>
      <button
        onClick={() => (window.location.pathname = "/")}
        style={{
          marginTop: "20px",
          padding: "10px 30px",
          background: "transparent",
          border: "1px solid #fff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        BACK TO REALITY
      </button>
    </div>
  );
};
export default NotFound;
