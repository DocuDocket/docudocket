export async function POST(request) {
  const { matter, answers } = await request.json();

  if (matter === "name-change") {
    const ok =
      answers.age18 === "yes" &&
      answers.county_resident === "yes" &&
      answers.lawful_reason === "yes";

    return Response.json({
      ok,
      message: ok
        ? "You appear eligible for an adult name change in Florida based on these answers. This is not legal advice."
        : "One or more answers suggests this path may not fit. Check with the clerk or an attorney."
    });
  }

  if (matter === "simplified-divorce") {
    const ok =
      answers.residency === "yes" &&
      answers.no_children === "yes" &&
      answers.agree_no_alimony === "yes" &&
      answers.both_attend === "yes";

    return Response.json({
      ok,
      message: ok
        ? "You appear eligible for a simplified dissolution of marriage in Florida based on these answers. This is not legal advice."
        : "You may not meet all simplified-dissolution requirements."
    });
  }

  return Response.json({ ok: false, message: "Unknown matter type." }, { status: 400 });
}
