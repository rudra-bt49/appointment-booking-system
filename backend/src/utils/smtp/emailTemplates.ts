export const approvedAppointmentTemplate = (data: {
  doctorName: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  amount: number;
}) => `
  <h2>Appointment Approved</h2>
  <p>Dear ${data.patientName},</p>

  <p>Your appointment with <b>Dr. ${data.doctorName}</b> has been <b>approved</b>.</p>

  <ul>
    <li><b>Date:</b> ${data.date}</li>
    <li><b>Time:</b> ${data.startTime} - ${data.endTime}</li>
    <li><b>Status:</b> Approved</li>
    <li><b>Payment:</b> ₹${data.amount} pending</li>
  </ul>

  <p>Please complete the payment within <b>30 minutes</b>, otherwise the appointment will expire.</p>
`;

export const rejectedAppointmentTemplate = (data: {
  doctorName: string;
  patientName: string;
  date: string;
}) => `
  <h2>Appointment Rejected</h2>
  <p>Dear ${data.patientName},</p>

  <p>We regret to inform you that your appointment with <b>Dr. ${data.doctorName}</b> has been <b>rejected</b>.</p>

  <p><b>Date:</b> ${data.date}</p>

  <p>Sorry for the inconvenience.</p>
`;

export const requestedAppointmentTemplate = (data: {
  doctorName: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
}) => `
  <h2>New Appointment Request</h2>

  <p>Dear Dr. ${data.doctorName},</p>

  <p>You have received a new appointment request.</p>

  <ul>
    <li><b>Patient:</b> ${data.patientName}</li>
    <li><b>Date:</b> ${data.date}</li>
    <li><b>Time:</b> ${data.startTime} - ${data.endTime}</li>
    <li><b>Status:</b> Requested</li>
  </ul>
`;

export const welcomeSignupTemplate = (data: {
  fullName: string;
  role: string;
  email: string;
  specialization?: string;
  experience?: number;
  gender?: string;
}) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>🎉 Welcome to Appointment Booking System!</h2>

    <p>Hi <b>${data.fullName}</b>,</p>

    <p>
      Congratulations! Your account has been successfully created as a 
      <b>${data.role}</b>.
    </p>

    <h3>📌 Account Details</h3>
    <ul>
      <li><b>Email:</b> ${data.email}</li>
      <li><b>Role:</b> ${data.role}</li>
      ${
        data.role === "DOCTOR"
          ? `
            <li><b>Specialization:</b> ${data.specialization}</li>
            <li><b>Experience:</b> ${data.experience} years</li>
          `
          : `
            <li><b>Gender:</b> ${data.gender}</li>
          `
      }
    </ul>

    <p>
      You can now log in and start using our platform.
    </p>

    <p>
      If you have any questions, feel free to contact our support team.
    </p>

    <br />
    <p>Regards,</p>
    <p><b>Appointment Booking System Team</b></p>
  </div>
`;
