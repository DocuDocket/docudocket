<button className="btn btn-light" type="button" onClick={back}>
  Back
</button>
<button
  className="btn btn-dark"
  type="submit"
  disabled={submitting}
>
  {submitting ? "Generating..." : "Finish & download PDF (demo)"}
</button>
<button
  className="btn btn-light"
  type="button"
  onClick={async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey: "name-change-hillsborough"
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout not available yet.");
      }
    } catch (e) {
      console.error(e);
      alert("Error starting checkout.");
    }
  }}
>
  Test Stripe Checkout
</button>
