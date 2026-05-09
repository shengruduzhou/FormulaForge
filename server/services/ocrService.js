function getDataUrl(body) {
  if (typeof body?.image === "string") return body.image;
  if (typeof body?.dataUrl === "string") return body.dataUrl;
  if (typeof body?.base64 === "string") {
    const mimeType = typeof body?.mimeType === "string" ? body.mimeType : "image/png";
    return `data:${mimeType};base64,${body.base64}`;
  }
  return "";
}

function cleanLatex(value) {
  return String(value ?? "")
    .replace(/^\$\$?|\$\$?$/g, "")
    .trim();
}

async function postJson(url, body, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : {};
    return { response, payload };
  } finally {
    clearTimeout(timeout);
  }
}

async function readWithLocalPix2tex(dataUrl) {
  const serviceUrl = process.env.OCR_SERVICE_URL;
  if (!serviceUrl) return null;

  const { response, payload } = await postJson(serviceUrl, { image: dataUrl });
  if (!response.ok) {
    throw Object.assign(new Error(payload.error ?? `Local OCR service failed with ${response.status}.`), { status: 502 });
  }

  const latex = cleanLatex(payload.latex ?? payload.text ?? payload.result);
  return latex ? { provider: "local-pix2tex", latex, confidence: payload.confidence ?? null } : null;
}

async function readWithMathpix(dataUrl) {
  const appId = process.env.MATHPIX_APP_ID;
  const appKey = process.env.MATHPIX_APP_KEY;
  if (!appId || !appKey) return null;

  const { response, payload } = await postJson(
    "https://api.mathpix.com/v3/text",
    {
      src: dataUrl,
      formats: ["latex_simplified", "latex_styled", "text"],
      data_options: { include_asciimath: false, include_latex: true },
    },
    {
      app_id: appId,
      app_key: appKey,
    },
  );

  if (!response.ok) {
    throw Object.assign(new Error(payload.error ?? `Mathpix failed with ${response.status}.`), { status: 502 });
  }

  const latex = cleanLatex(payload.latex_simplified ?? payload.latex_styled ?? payload.text);
  return latex ? { provider: "mathpix", latex, confidence: payload.confidence ?? null } : null;
}

export async function recognizeFormulaImage(body) {
  const dataUrl = getDataUrl(body);
  if (!dataUrl) {
    return {
      status: 400,
      payload: {
        error: "Image is required. Send JSON with image as a data URL or base64.",
      },
    };
  }

  if (!process.env.OCR_SERVICE_URL && (!process.env.MATHPIX_APP_ID || !process.env.MATHPIX_APP_KEY)) {
    return {
      status: 503,
      payload: {
        error: "OCR is not configured. Set OCR_SERVICE_URL for a local pix2tex service, or set MATHPIX_APP_ID and MATHPIX_APP_KEY.",
        provider: "none",
        latex: "",
      },
    };
  }

  const localResult = await readWithLocalPix2tex(dataUrl);
  if (localResult) {
    return { status: 200, payload: localResult };
  }

  const mathpixResult = await readWithMathpix(dataUrl);
  if (mathpixResult) {
    return { status: 200, payload: mathpixResult };
  }

  return {
    status: 422,
    payload: {
      error: "OCR provider returned no LaTeX. Try a clearer crop or enter the formula manually.",
      provider: "configured",
      latex: "",
    },
  };
}
