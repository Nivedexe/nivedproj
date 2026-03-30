import dotenv from 'dotenv';
dotenv.config();

const testEndpoint = async () => {
    try {
        const res1 = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'john.v@example.com', password: 'password123' })
        });
        const data1 = await res1.json();
        const token = data1.token;

        const res2 = await fetch('http://localhost:5000/api/conventions/registrations', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const text2 = await res2.text();
        console.log("Status:", res2.status);
        console.log("Raw response (first 200 chars):", text2.substring(0, 200));

        const res3 = await fetch('http://localhost:5000/api/feedback', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data3 = await res3.json();
        console.log("Feedback Status:", res3.status);
        console.log("Feedback count:", data3.length);

    } catch (e) {
        console.error(e);
    }
};

testEndpoint();
