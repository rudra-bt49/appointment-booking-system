import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:5000';
const LOGIN_ENDPOINT = '/api/auth/login';
const APPOINTMENT_ENDPOINT = '/api/appointments/request';

// Patient credentials
const PATIENT_1_CREDENTIALS = {
  email: 'om@gmail.com',
  password: 'Om@12345',
};

const PATIENT_2_CREDENTIALS = {
  email: 'rudra@gmail.com', // Replace with your second patient email
  password: 'Rudra@123',   // Replace with your second patient password
};

// Replace with actual IDs from your database
const DOCTOR_ID = 3;
const TIME_SLOT_ID = 57; // Make sure this slot is available

interface AppointmentRequest {
  doctorId: number;
  timeSlotId: number;
  notes?: string;
}

interface TestResult {
  success: boolean;
  patient: string;
  error?: string;
}

/**
 * Login and get cookies
 */
async function login(email: string, password: string): Promise<string> {
  try {
    const response = await axios.post(
      `${BASE_URL}${LOGIN_ENDPOINT}`,
      { email, password },
      {
        withCredentials: true, // Important for cookies
      }
    );

    // Extract cookies from response headers
    const cookies = response.headers['set-cookie'];
    if (!cookies || cookies.length === 0) {
      throw new Error('No cookies received from login');
    }

    // Join all cookies into a single string
    const cookieString = cookies.map(cookie => cookie.split(';')[0]).join('; ');
    console.log(`✅ Logged in as ${email}`);
    
    return cookieString;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(`❌ Login failed for ${email}:`, axiosError.response?.data?.message || axiosError.message);
    throw error;
  }
}

/**
 * Make appointment request with cookies
 */
async function makeAppointmentRequest(
  cookies: string,
  patientName: string
): Promise<TestResult> {
  try {
    const response = await axios.post(
      `${BASE_URL}${APPOINTMENT_ENDPOINT}`,
      {
        doctorId: DOCTOR_ID,
        timeSlotId: TIME_SLOT_ID,
        notes: `Test booking by ${patientName}`,
      } as AppointmentRequest,
      {
        headers: {
          Cookie: cookies,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    console.log(`✅ ${patientName} SUCCESS:`, response.data.message);
    return { success: true, patient: patientName };
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const errorMessage = axiosError.response?.data?.message || axiosError.message;
    
    console.log(`❌ ${patientName} FAILED:`, errorMessage);
    return { 
      success: false, 
      patient: patientName, 
      error: errorMessage 
    };
  }
}

async function testRaceCondition(): Promise<void> {
  console.log('🏁 Starting race condition test...\n');
  
  // Step 1: Login both patients
  console.log('📝 Step 1: Logging in patients...\n');
  
  const patient1Cookies = await login(
    PATIENT_1_CREDENTIALS.email,
    PATIENT_1_CREDENTIALS.password
  );
  
  const patient2Cookies = await login(
    PATIENT_2_CREDENTIALS.email,
    PATIENT_2_CREDENTIALS.password
  );
  
  console.log('\n✅ Both patients logged in successfully\n');
  console.log(`📍 Testing with TIME_SLOT_ID: ${TIME_SLOT_ID}`);
  console.log(`👨‍⚕️ DOCTOR_ID: ${DOCTOR_ID}\n`);

  // Step 2: Send both requests at the EXACT same time
  console.log('⚡ Step 2: Sending concurrent appointment requests...\n');
  
  const [result1, result2] = await Promise.all([
    makeAppointmentRequest(patient1Cookies, 'Patient 1'),
    makeAppointmentRequest(patient2Cookies, 'Patient 2'),
  ]);

  // Step 3: Display results
  console.log('\n📊 Test Results:');
  console.log('================');
  console.log(`Patient 1: ${result1.success ? '✅ BOOKED' : '❌ REJECTED'}`);
  console.log(`Patient 2: ${result2.success ? '✅ BOOKED' : '❌ REJECTED'}`);

  const successCount = [result1, result2].filter((r) => r.success).length;

  console.log('\n🎯 Validation:');
  if (successCount === 1) {
    console.log('✅ PASS: Exactly one appointment was created (race condition prevented!)');
  } else if (successCount === 2) {
    console.log('❌ FAIL: Both appointments were created (race condition NOT prevented!)');
  } else {
    console.log('⚠️  WARN: Neither appointment was created (check slot availability)');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('- Check database to verify only 1 appointment exists');
  console.log('- Reset the slot and run again if needed');
  console.log('\nSQL Query to check:');
  console.log(`SELECT * FROM "Appointment" WHERE "timeSlotId" = ${TIME_SLOT_ID};`);
}

testRaceCondition().catch((error) => {
  console.error('❌ Test failed with error:', error);
  process.exit(1);
});