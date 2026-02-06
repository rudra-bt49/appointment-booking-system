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
