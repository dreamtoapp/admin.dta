import fetch from 'node-fetch';

async function testAPIEndpoint() {
  try {
    console.log('🧪 Testing API endpoint...');

    // Test data
    const testData = {
      fullName: "Test User Updated",
      mobile: "+1234567890",
      contactEmail: "test@example.com",
      nationality: "Test Country"
    };

    console.log('📤 Sending test data:', testData);

    // Test the API endpoint
    const response = await fetch('http://localhost:3000/api/users/68a098af3ca56163596ca853', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', response.headers);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ API call successful:', result);
    } else {
      const errorText = await response.text();
      console.error('❌ API call failed:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAPIEndpoint();
