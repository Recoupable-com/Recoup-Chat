const sendEmail = async (data: {
  from: string;
  to: string | string[];
  cc?: string[];
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
}) => {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export default sendEmail;
