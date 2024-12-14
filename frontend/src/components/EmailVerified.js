import React from "react";

const EmailVerified = () => {
  return (
    <div className="email-verified-container">
      <h1>Email Verified!</h1>
      <p>Thank you for verifying your email. You can now log in to your account.</p>
      <a href="/login" className="btn btn-primary">
        Go to Login
      </a>
    </div>
  );
};

export default EmailVerified;
